"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const changeCase = tslib_1.__importStar(require("change-case"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const json5_1 = tslib_1.__importDefault(require("json5"));
const path_1 = tslib_1.__importDefault(require("path"));
const request_promise_native_1 = tslib_1.__importDefault(require("request-promise-native"));
const vtils_1 = require("vtils");
const types_1 = require("./types");
const utils_1 = require("./utils");
class Generator {
    constructor(config, options = { cwd: process.cwd() }) {
        this.options = options;
        /** 配置 */
        this.config = [];
        /** { 项目标识: 分类列表 } */
        this.projectIdToCategoryList = Object.create(null);
        // config 可能是对象或数组，统一为数组
        this.config = vtils_1.castArray(config);
    }
    async generate() {
        const outputFileList = Object.create(null);
        await Promise.all(this.config.map(async (serverConfig, serverIndex) => Promise.all(serverConfig.projects.map(async (projectConfig, projectIndex) => {
            const projectInfo = await Generator.fetchProjectInfo(Object.assign({}, serverConfig, projectConfig));
            await Promise.all(projectConfig.categories.map(async (categoryConfig, categoryIndex) => {
                const categoryIds = categoryConfig.id === 0
                    ? projectInfo.cats.map(cat => cat._id)
                    : vtils_1.castArray(categoryConfig.id)
                        .filter(id => !!projectInfo.cats.find(cat => cat._id === id));
                await Promise.all(categoryIds.map(async (id, categoryIndex2) => {
                    categoryConfig = Object.assign({}, categoryConfig, { id: id });
                    const syntheticalConfig = Object.assign({}, serverConfig, projectConfig, categoryConfig, { mockUrl: projectInfo.getMockUrl() });
                    syntheticalConfig.devUrl = projectInfo.getDevUrl(syntheticalConfig.devEnvName);
                    syntheticalConfig.prodUrl = projectInfo.getProdUrl(syntheticalConfig.prodEnvName);
                    const interfaceList = await this.fetchInterfaceList(syntheticalConfig);
                    const outputFilePath = path_1.default.resolve(this.options.cwd, syntheticalConfig.outputFilePath);
                    const categoryUID = `_${serverIndex}_${projectIndex}_${categoryIndex}_${categoryIndex2}`;
                    const categoryCode = interfaceList.length === 0 ? '' : [
                        syntheticalConfig.typesOnly
                            ? ''
                            : vtils_1.dedent `
                              const mockUrl${categoryUID} = ${JSON.stringify(syntheticalConfig.mockUrl)} as any
                              const devUrl${categoryUID} = ${JSON.stringify(syntheticalConfig.devUrl)} as any
                              const prodUrl${categoryUID} = ${JSON.stringify(syntheticalConfig.prodUrl)} as any
                              const dataKey${categoryUID} = ${JSON.stringify(syntheticalConfig.dataKey)} as any
                            `,
                        ...(await Promise.all(interfaceList.map(async (interfaceInfo) => {
                            interfaceInfo = vtils_1.isFunction(syntheticalConfig.preproccessInterface)
                                ? syntheticalConfig.preproccessInterface(interfaceInfo, changeCase)
                                : interfaceInfo;
                            return Generator.generateInterfaceCode(syntheticalConfig, interfaceInfo, categoryUID);
                        }))),
                    ].join('\n\n');
                    if (!outputFileList[outputFilePath]) {
                        outputFileList[outputFilePath] = {
                            syntheticalConfig,
                            content: [],
                            requestFilePath: (syntheticalConfig.requestFunctionFilePath
                                ? path_1.default.resolve(this.options.cwd, syntheticalConfig.requestFunctionFilePath)
                                : path_1.default.join(path_1.default.dirname(outputFilePath), 'request.ts')),
                        };
                    }
                    outputFileList[outputFilePath].content.push(categoryCode);
                }));
            }));
        }))));
        return outputFileList;
    }
    async write(outputFileList) {
        return Promise.all(Object.keys(outputFileList).map(async (outputFilePath) => {
            const { content, requestFilePath, syntheticalConfig } = outputFileList[outputFilePath];
            // 若非 typesOnly 模式且 request 文件不存在，则写入 request 文件
            if (!syntheticalConfig.typesOnly && !(await fs_extra_1.default.pathExists(requestFilePath))) {
                await fs_extra_1.default.outputFile(requestFilePath, vtils_1.dedent `
              import { RequestFunction } from 'yapi-to-typescript'

              /** 是否是生产环境 */
              const isProd = false

              /**
               * 请求函数。
               *
               * **注意**：若 dataKey 不为空，取得接口返回值后，应类似这样返回结果：
               *
               * \`\`\`js
               * return dataKey ? (response[dataKey] || response) : response
               * \`\`\`
               */
              const request: RequestFunction = ({
                /** 接口 Mock 地址，结尾无 \`/\` */
                mockUrl,
                /** 接口测试环境地址，结尾无 \`/\` */
                devUrl,
                /** 接口生产环境地址，结尾无 \`/\` */
                prodUrl,
                /** 接口路径，以 \`/\` 开头 */
                path,
                /** 请求方法 */
                method,
                /** 请求数据类型 */
                requestBodyType,
                /** 返回数据类型 */
                responseBodyType,
                /** 接口返回值中数据所在的键 */
                dataKey,
                /** 请求数据，不含文件数据 */
                data,
                /** 请求文件数据 */
                fileData
              }): Promise<any> => {
                return new Promise((resolve, reject) => {
                  /** 请求地址 */
                  const url = \`\${isProd ? prodUrl : mockUrl}\${path}\`

                  /** 是否含有文件数据 */
                  const hasFileData = Object.keys(fileData).length > 0

                  // 在这里实现请求逻辑
                })
              }

              export default request
            `);
            }
            // 始终写入主文件
            const requestFileRelativePath = utils_1.getNormalizedRelativePath(path_1.default.dirname(outputFilePath), requestFilePath);
            const requestFileRelativePathWithoutExt = requestFileRelativePath.replace(/\.(ts|js)$/i, '');
            await fs_extra_1.default.outputFile(outputFilePath, vtils_1.dedent `
            /* tslint:disable */
            /* eslint-disable */

            /* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

            ${syntheticalConfig.typesOnly ? content.join('\n\n').trim() : vtils_1.dedent `
              // @ts-ignore
              import { Method, RequestBodyType, ResponseBodyType, RequestConfig, FileData, prepare } from 'yapi-to-typescript'
              ${!syntheticalConfig.reactHooks || !syntheticalConfig.reactHooks.enable ? '' : vtils_1.dedent `
                // @ts-ignore
                import { createApiHook } from 'yapi-to-typescript'
                // @ts-ignore
                import { useState, useEffect } from '${syntheticalConfig.reactHooks.pragma || 'react'}'
              `}
              import request from ${JSON.stringify(requestFileRelativePathWithoutExt)}

              ${content.join('\n\n').trim()}
            `}
          `);
        }));
    }
    /** 生成请求数据类型 */
    static async generateRequestDataType({ interfaceInfo, typeName }) {
        let jsonSchema;
        switch (interfaceInfo.method) {
            case types_1.Method.GET:
            case types_1.Method.HEAD:
            case types_1.Method.OPTIONS:
                jsonSchema = utils_1.propDefinitionsToJsonSchema(interfaceInfo.req_query.map(item => ({
                    name: item.name,
                    required: item.required === types_1.Required.true,
                    type: ['string', 'number'],
                    comment: item.desc,
                })));
                if (Object.keys(jsonSchema.properties).length > 0) {
                    jsonSchema.additionalProperties = true;
                }
                break;
            default:
                switch (interfaceInfo.req_body_type) {
                    case types_1.RequestBodyType.form:
                        jsonSchema = utils_1.propDefinitionsToJsonSchema(interfaceInfo.req_body_form.map(item => ({
                            name: item.name,
                            required: item.required === types_1.Required.true,
                            type: (item.type === types_1.RequestFormItemType.file ? 'file' : 'string'),
                            comment: item.desc,
                        })));
                        break;
                    case types_1.RequestBodyType.json:
                        if (interfaceInfo.req_body_other) {
                            jsonSchema = interfaceInfo.req_body_is_json_schema
                                ? utils_1.jsonSchemaStringToJsonSchema(interfaceInfo.req_body_other)
                                : utils_1.jsonToJsonSchema(json5_1.default.parse(interfaceInfo.req_body_other));
                        }
                        break;
                    default:
                        /* istanbul ignore next */
                        break;
                }
                break;
        }
        if (vtils_1.isArray(interfaceInfo.req_params) && interfaceInfo.req_params.length) {
            const paramsJsonSchema = utils_1.propDefinitionsToJsonSchema(interfaceInfo.req_params.map(item => ({
                name: item.name,
                required: true,
                type: 'string',
                comment: item.desc,
            })));
            if (jsonSchema) {
                jsonSchema.properties = Object.assign({}, jsonSchema.properties, paramsJsonSchema.properties);
                jsonSchema.required = [
                    ...(jsonSchema.required || []),
                    ...(paramsJsonSchema.required || []),
                ];
            }
            else {
                jsonSchema = paramsJsonSchema;
            }
        }
        return utils_1.jsonSchemaToType(jsonSchema, typeName);
    }
    /** 生成响应数据类型 */
    static async generateResponseDataType({ interfaceInfo, typeName, dataKey }) {
        let jsonSchema = {};
        switch (interfaceInfo.res_body_type) {
            case types_1.ResponseBodyType.json:
                if (interfaceInfo.res_body) {
                    let json = JSON.parse(interfaceInfo.res_body);
                    if (json.properties && json.properties.data) {
                        let type = json.properties.data.type;
                        if (type === "array") {
                            const required = [];
                            for (const key in json.properties.data.items.properties) {
                                required.push(key);
                            }
                            json.properties.data.items.required = required;
                        }
                        if (type === "object") {
                            if (json.properties.data.properties && json.properties.data.properties.content && json.properties.data.properties.content.type === 'array') {
                                const required = [];
                                for (const key in json.properties.data.properties.content.items.properties) {
                                    required.push(key);
                                }
                                json.properties.data.properties.content.items.required = required;
                            }
                            const required = [];
                            for (const key in json.properties.data.properties) {
                                required.push(key);
                            }
                            json.properties.data.required = required;
                        }
                        interfaceInfo.res_body = JSON.stringify(json);
                    }
                    jsonSchema = interfaceInfo.res_body_is_json_schema
                        ? utils_1.jsonSchemaStringToJsonSchema(interfaceInfo.res_body)
                        : utils_1.mockjsTemplateToJsonSchema(json5_1.default.parse(interfaceInfo.res_body));
                }
                break;
            default:
                return `export type ${typeName} = any`;
        }
        if (dataKey && jsonSchema && jsonSchema.properties && jsonSchema.properties[dataKey]) {
            jsonSchema = jsonSchema.properties[dataKey];
        }
        return utils_1.jsonSchemaToType(jsonSchema, typeName);
    }
    static async fetchApi(url, query) {
        const res = await request_promise_native_1.default.get(url, { qs: query, json: true });
        /* istanbul ignore next */
        if (res && res.errcode) {
            utils_1.throwError(res.errmsg);
        }
        return res.data || res;
    }
    /** 获取分类的接口列表 */
    async fetchInterfaceList({ serverUrl, token, id }) {
        const projectId = `${serverUrl}|${token}`;
        if (!(projectId in this.projectIdToCategoryList)) {
            const categoryList = await Generator.fetchApi(`${serverUrl}/api/plugin/export`, {
                type: 'json',
                status: 'all',
                isWiki: 'false',
                token: token,
            });
            this.projectIdToCategoryList[projectId] = categoryList;
        }
        const category = (this.projectIdToCategoryList[projectId] || []).find(cat => (!vtils_1.isEmpty(cat)
            && !vtils_1.isEmpty(cat.list)
            && cat.list[0].catid === id));
        return category ? category.list : [];
    }
    /** 获取项目信息 */
    static async fetchProjectInfo(syntheticalConfig) {
        const projectInfo = await this.fetchApi(`${syntheticalConfig.serverUrl}/api/project/get`, { token: syntheticalConfig.token });
        const projectCats = await this.fetchApi(`${syntheticalConfig.serverUrl}/api/interface/getCatMenu`, { token: syntheticalConfig.token, project_id: projectInfo._id });
        return Object.assign({}, projectInfo, { cats: projectCats, getMockUrl: () => `${syntheticalConfig.serverUrl}/mock/${projectInfo._id}`, getDevUrl: (devEnvName) => {
                const env = projectInfo.env.find(e => e.name === devEnvName);
                return env && env.domain || '';
            }, getProdUrl: (prodEnvName) => {
                const env = projectInfo.env.find(e => e.name === prodEnvName);
                return env && env.domain || '';
            } });
    }
    /** 生成接口代码 */
    static async generateInterfaceCode(syntheticalConfig, interfaceInfo, categoryUID) {
        const extendedInterfaceInfo = Object.assign({}, interfaceInfo, { parsedPath: path_1.default.parse(interfaceInfo.path) });
        const requestFunctionName = vtils_1.isFunction(syntheticalConfig.getRequestFunctionName)
            ? await syntheticalConfig.getRequestFunctionName(extendedInterfaceInfo, changeCase)
            : changeCase.camelCase(interfaceInfo.parsedPath.name);
        const requestDataTypeName = vtils_1.isFunction(syntheticalConfig.getRequestDataTypeName)
            ? await syntheticalConfig.getRequestDataTypeName(extendedInterfaceInfo, changeCase)
            : changeCase.pascalCase(`${requestFunctionName}Request`);
        const responseDataTypeName = vtils_1.isFunction(syntheticalConfig.getResponseDataTypeName)
            ? await syntheticalConfig.getResponseDataTypeName(extendedInterfaceInfo, changeCase)
            : changeCase.pascalCase(`${requestFunctionName}Response`);
        const requestDataType = await Generator.generateRequestDataType({
            interfaceInfo: interfaceInfo,
            typeName: requestDataTypeName,
        });
        const responseDataType = await Generator.generateResponseDataType({
            interfaceInfo: interfaceInfo,
            typeName: responseDataTypeName,
            dataKey: syntheticalConfig.dataKey,
        });
        const isRequestDataOptional = /(\{\}|any)$/s.test(requestDataType);
        let autoApiHookName;
        let manualApiHookName;
        if (syntheticalConfig.reactHooks && syntheticalConfig.reactHooks.enable) {
            autoApiHookName = vtils_1.isFunction(syntheticalConfig.reactHooks.getAutoApiHookName)
                ? await syntheticalConfig.reactHooks.getAutoApiHookName(extendedInterfaceInfo, changeCase)
                : `useAutoApi${changeCase.pascalCase(requestFunctionName)}`;
            manualApiHookName = vtils_1.isFunction(syntheticalConfig.reactHooks.getManualApiHookName)
                ? await syntheticalConfig.reactHooks.getManualApiHookName(extendedInterfaceInfo, changeCase)
                : `useManualApi${changeCase.pascalCase(requestFunctionName)}`;
        }
        // 支持路径参数
        const paramNames = (interfaceInfo.req_params || []).map(item => item.name);
        const paramNamesLiteral = JSON.stringify(paramNames);
        const paramNameType = paramNames.length === 0 ? 'string' : `'${paramNames.join('\' | \'')}'`;
        // 转义标题中的 /
        const escapedTitle = String(interfaceInfo.title).replace(/\//g, '\\/');
        return vtils_1.dedent `
      /**
       * 接口 **${escapedTitle}** 的 **请求类型**
       */
      ${requestDataType.trim()}

      /**
       * 接口 **${escapedTitle}** 的 **返回类型**
       */
      ${responseDataType.trim()}

      ${syntheticalConfig.typesOnly ? '' : vtils_1.dedent `
        /**
         * 接口 **${escapedTitle}** 的 **请求函数**
         */
        export function ${requestFunctionName}(requestData${isRequestDataOptional ? '?' : ''}: ${requestDataTypeName}): Promise<${responseDataTypeName}> {
          return request(prepare(${requestFunctionName}.requestConfig, requestData))
        }

        /**
         * 接口 **${escapedTitle}** 的 **请求配置**
         */
        ${requestFunctionName}.requestConfig = Object.freeze({
          mockUrl: mockUrl${categoryUID},
          devUrl: devUrl${categoryUID},
          prodUrl: prodUrl${categoryUID},
          path: ${JSON.stringify(interfaceInfo.path)},
          method: Method.${interfaceInfo.method},
          requestBodyType: RequestBodyType.${interfaceInfo.method === types_1.Method.GET ? types_1.RequestBodyType.query : interfaceInfo.req_body_type || types_1.RequestBodyType.none},
          responseBodyType: ResponseBodyType.${interfaceInfo.res_body_type},
          dataKey: dataKey${categoryUID},
          paramNames: ${paramNamesLiteral},
        } as RequestConfig<
          ${JSON.stringify(syntheticalConfig.mockUrl)},
          ${JSON.stringify(syntheticalConfig.devUrl)},
          ${JSON.stringify(syntheticalConfig.prodUrl)},
          ${JSON.stringify(interfaceInfo.path)},
          ${JSON.stringify(syntheticalConfig.dataKey)},
          ${paramNameType}
        >)

        ${(!syntheticalConfig.reactHooks || !syntheticalConfig.reactHooks.enable) ? '' : vtils_1.dedent `
          /**
           * 接口 **${escapedTitle}** 的 **自动触发 API 的 React Hook**
           */
          export const ${autoApiHookName} = createApiHook<typeof ${requestFunctionName}, ${isRequestDataOptional}>({
            useState: useState,
            useEffect: useEffect,
            requestFunction: ${requestFunctionName},
            autoTrigger: true,
          })

          /**
           * 接口 **${escapedTitle}** 的 **手动触发 API 的 React Hook**
           */
          export const ${manualApiHookName} = createApiHook<typeof ${requestFunctionName}, ${isRequestDataOptional}>({
            useState: useState,
            useEffect: useEffect,
            requestFunction: ${requestFunctionName},
            autoTrigger: false,
          })
        `}
      `}
    `;
    }
}
exports.Generator = Generator;
