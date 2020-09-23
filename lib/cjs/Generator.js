"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
var tslib_1 = require("tslib");
var changeCase = tslib_1.__importStar(require("change-case"));
var dayjs_1 = tslib_1.__importDefault(require("dayjs"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var got_1 = tslib_1.__importDefault(require("got"));
var json5_1 = tslib_1.__importDefault(require("json5"));
var path_1 = tslib_1.__importDefault(require("path"));
var prettier_1 = tslib_1.__importDefault(require("prettier"));
var vtils_1 = require("vtils");
var types_1 = require("./types");
var child_process_1 = require("child_process");
var utils_1 = require("./utils");
var Generator = /** @class */ (function () {
    function Generator(config, options) {
        var _this = this;
        if (options === void 0) { options = { cwd: process.cwd() }; }
        this.options = options;
        /** 配置 */
        this.config = [];
        this.fetchProject = vtils_1.memoize(function (_a) {
            var serverUrl = _a.serverUrl, token = _a.token;
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var projectInfo, basePath;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.fetchApi(serverUrl + "/api/project/get", {
                                token: token,
                            })];
                        case 1:
                            projectInfo = _b.sent();
                            basePath = ("/" + (projectInfo.basepath || '/'))
                                .replace(/\/+$/, '')
                                .replace(/^\/+/, '/');
                            projectInfo.basepath = basePath;
                            return [2 /*return*/, projectInfo];
                    }
                });
            });
        }, function (_a) {
            var serverUrl = _a.serverUrl, token = _a.token;
            return serverUrl + "|" + token;
        });
        this.fetchExport = vtils_1.memoize(function (_a) {
            var serverUrl = _a.serverUrl, token = _a.token;
            return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var projectInfo, categoryList;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.fetchProject({ serverUrl: serverUrl, token: token })];
                        case 1:
                            projectInfo = _b.sent();
                            return [4 /*yield*/, this.fetchApi(serverUrl + "/api/plugin/export", {
                                    type: 'json',
                                    status: 'all',
                                    isWiki: 'false',
                                    token: token,
                                })];
                        case 2:
                            categoryList = _b.sent();
                            return [2 /*return*/, categoryList.map(function (cat) {
                                    cat.list = (cat.list || []).map(function (item) {
                                        item.path = "" + projectInfo.basepath + item.path;
                                        return item;
                                    });
                                    return cat;
                                })];
                    }
                });
            });
        }, function (_a) {
            var serverUrl = _a.serverUrl, token = _a.token;
            return serverUrl + "|" + token;
        });
        this.config =
            // config 可能是对象或数组，统一为数组
            vtils_1.castArray(config).map(function (item) {
                if (item.serverUrl) {
                    // 去除地址后面的 /
                    // fix: https://github.com/fjc0k/yapi-to-typescript/issues/22
                    item.serverUrl = item.serverUrl.replace(/\/+$/, '');
                }
                return item;
            });
    }
    Generator.prototype.generate = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var outputFileList;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        outputFileList = Object.create(null);
                        return [4 /*yield*/, Promise.all(this.config.map(function (serverConfig, serverIndex) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var projects;
                                var _this = this;
                                return tslib_1.__generator(this, function (_a) {
                                    projects = serverConfig.projects.reduce(function (projects, project) {
                                        projects.push.apply(projects, vtils_1.castArray(project.token).map(function (token) { return (tslib_1.__assign(tslib_1.__assign({}, project), { token: token })); }));
                                        return projects;
                                    }, []);
                                    return [2 /*return*/, Promise.all(projects.map(function (projectConfig, projectIndex) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                            var projectInfo;
                                            var _this = this;
                                            return tslib_1.__generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, this.fetchProjectInfo(tslib_1.__assign(tslib_1.__assign({}, serverConfig), projectConfig))];
                                                    case 1:
                                                        projectInfo = _a.sent();
                                                        return [4 /*yield*/, Promise.all(projectConfig.categories.map(function (categoryConfig, categoryIndex) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                                var categoryIds, excludedCategoryIds, codes, _i, _a, groupedCodes;
                                                                var _b;
                                                                var _this = this;
                                                                return tslib_1.__generator(this, function (_c) {
                                                                    switch (_c.label) {
                                                                        case 0:
                                                                            categoryIds = vtils_1.castArray(categoryConfig.id);
                                                                            // 全部分类
                                                                            if (categoryIds.includes(0)) {
                                                                                categoryIds.push.apply(categoryIds, projectInfo.cats.map(function (cat) { return cat._id; }));
                                                                            }
                                                                            // 唯一化
                                                                            categoryIds = vtils_1.uniq(categoryIds);
                                                                            excludedCategoryIds = categoryIds
                                                                                .filter(function (id) { return id < 0; })
                                                                                .map(Math.abs);
                                                                            categoryIds = categoryIds.filter(function (id) { return !excludedCategoryIds.includes(Math.abs(id)); });
                                                                            // 删除不存在的分类
                                                                            categoryIds = categoryIds.filter(function (id) { return !!projectInfo.cats.find(function (cat) { return cat._id === id; }); });
                                                                            // 顺序化
                                                                            categoryIds = categoryIds.sort();
                                                                            return [4 /*yield*/, Promise.all(categoryIds.map(function (id, categoryIndex2) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                                                    var syntheticalConfig, interfaceList, outputFilePath, categoryUID, categoryCode, _a, _b;
                                                                                    var _this = this;
                                                                                    return tslib_1.__generator(this, function (_c) {
                                                                                        switch (_c.label) {
                                                                                            case 0:
                                                                                                categoryConfig = tslib_1.__assign(tslib_1.__assign({}, categoryConfig), { id: id });
                                                                                                syntheticalConfig = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, serverConfig), projectConfig), categoryConfig), { mockUrl: projectInfo.getMockUrl() });
                                                                                                syntheticalConfig.target =
                                                                                                    syntheticalConfig.target || 'typescript';
                                                                                                syntheticalConfig.devUrl = projectInfo.getDevUrl(syntheticalConfig.devEnvName);
                                                                                                syntheticalConfig.prodUrl = projectInfo.getProdUrl(syntheticalConfig.prodEnvName);
                                                                                                return [4 /*yield*/, this.fetchInterfaceList(syntheticalConfig)];
                                                                                            case 1:
                                                                                                interfaceList = (_c.sent()).sort(function (a, b) { return a._id - b._id; });
                                                                                                outputFilePath = path_1.default.resolve(this.options.cwd, syntheticalConfig.outputFilePath);
                                                                                                categoryUID = "_" + serverIndex + "_" + projectIndex + "_" + categoryIndex + "_" + categoryIndex2;
                                                                                                if (!(interfaceList.length === 0)) return [3 /*break*/, 2];
                                                                                                _a = '';
                                                                                                return [3 /*break*/, 4];
                                                                                            case 2:
                                                                                                _b = [[
                                                                                                        syntheticalConfig.typesOnly
                                                                                                            ? ''
                                                                                                            : vtils_1.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n                                  const mockUrl", " = ", " as any\n                                  const devUrl", " = ", " as any\n                                  const prodUrl", " = ", " as any\n                                  const dataKey", " = ", " as any\n                                "], ["\n                                  const mockUrl", " = ",
                                                                                                                " as any\n                                  const devUrl", " = ",
                                                                                                                " as any\n                                  const prodUrl", " = ",
                                                                                                                " as any\n                                  const dataKey", " = ",
                                                                                                                " as any\n                                "])), categoryUID, JSON.stringify(syntheticalConfig.mockUrl), categoryUID, JSON.stringify(syntheticalConfig.devUrl), categoryUID, JSON.stringify(syntheticalConfig.prodUrl), categoryUID, JSON.stringify(syntheticalConfig.dataKey))
                                                                                                    ]];
                                                                                                return [4 /*yield*/, Promise.all(interfaceList.map(function (interfaceInfo) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                                                                        return tslib_1.__generator(this, function (_a) {
                                                                                                            interfaceInfo = vtils_1.isFunction(syntheticalConfig.preproccessInterface)
                                                                                                                ? syntheticalConfig.preproccessInterface(interfaceInfo, changeCase)
                                                                                                                : interfaceInfo;
                                                                                                            return [2 /*return*/, this.generateInterfaceCode(syntheticalConfig, interfaceInfo, categoryUID)];
                                                                                                        });
                                                                                                    }); }))];
                                                                                            case 3:
                                                                                                _a = tslib_1.__spreadArrays.apply(void 0, _b.concat([(_c.sent())])).join('\n\n');
                                                                                                _c.label = 4;
                                                                                            case 4:
                                                                                                categoryCode = _a;
                                                                                                if (!outputFileList[outputFilePath]) {
                                                                                                    outputFileList[outputFilePath] = {
                                                                                                        syntheticalConfig: syntheticalConfig,
                                                                                                        content: [],
                                                                                                        requestFunctionFilePath: syntheticalConfig.requestFunctionFilePath
                                                                                                            ? path_1.default.resolve(this.options.cwd, syntheticalConfig.requestFunctionFilePath)
                                                                                                            : path_1.default.join(path_1.default.dirname(outputFilePath), 'request.ts'),
                                                                                                        requestHookMakerFilePath: syntheticalConfig.reactHooks &&
                                                                                                            syntheticalConfig.reactHooks.enabled
                                                                                                            ? syntheticalConfig.reactHooks
                                                                                                                .requestHookMakerFilePath
                                                                                                                ? path_1.default.resolve(this.options.cwd, syntheticalConfig.reactHooks
                                                                                                                    .requestHookMakerFilePath)
                                                                                                                : path_1.default.join(path_1.default.dirname(outputFilePath), 'makeRequestHook.ts')
                                                                                                            : '',
                                                                                                    };
                                                                                                }
                                                                                                return [2 /*return*/, {
                                                                                                        outputFilePath: outputFilePath,
                                                                                                        code: categoryCode,
                                                                                                        weights: [
                                                                                                            serverIndex,
                                                                                                            projectIndex,
                                                                                                            categoryIndex,
                                                                                                            categoryIndex2,
                                                                                                        ],
                                                                                                    }];
                                                                                        }
                                                                                    });
                                                                                }); }))];
                                                                        case 1:
                                                                            codes = _c.sent();
                                                                            for (_i = 0, _a = vtils_1.values(vtils_1.groupBy(codes, function (item) { return item.outputFilePath; })); _i < _a.length; _i++) {
                                                                                groupedCodes = _a[_i];
                                                                                groupedCodes.sort(function (a, b) {
                                                                                    var _a;
                                                                                    var x = a.weights.length > b.weights.length ? b : a;
                                                                                    var minLen = Math.min(a.weights.length, b.weights.length);
                                                                                    var maxLen = Math.max(a.weights.length, b.weights.length);
                                                                                    (_a = x.weights).push.apply(_a, new Array(maxLen - minLen).fill(0));
                                                                                    var w = a.weights.reduce(function (w, _, i) {
                                                                                        if (w === 0) {
                                                                                            w = a.weights[i] - b.weights[i];
                                                                                        }
                                                                                        return w;
                                                                                    }, 0);
                                                                                    return w;
                                                                                });
                                                                                (_b = outputFileList[groupedCodes[0].outputFilePath].content).push.apply(_b, groupedCodes.map(function (item) { return item.code; }));
                                                                            }
                                                                            return [2 /*return*/];
                                                                    }
                                                                });
                                                            }); }))];
                                                    case 2:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }))];
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, outputFileList];
                }
            });
        });
    };
    Generator.prototype.write = function (outputFileList) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, Promise.all(Object.keys(outputFileList).map(function (outputFilePath) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var _a, 
                        // eslint-disable-next-line prefer-const
                        content, requestFunctionFilePath, requestHookMakerFilePath, 
                        // eslint-disable-next-line prefer-const
                        syntheticalConfig, rawRequestFunctionFilePath, rawRequestHookMakerFilePath, _b, rawOutputContent, prettyOutputContent, outputContent;
                        return tslib_1.__generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _a = outputFileList[outputFilePath], content = _a.content, requestFunctionFilePath = _a.requestFunctionFilePath, requestHookMakerFilePath = _a.requestHookMakerFilePath, syntheticalConfig = _a.syntheticalConfig;
                                    rawRequestFunctionFilePath = requestFunctionFilePath;
                                    rawRequestHookMakerFilePath = requestHookMakerFilePath;
                                    // 支持 .jsx? 后缀
                                    outputFilePath = outputFilePath.replace(/\.js(x)?$/, '.ts$1');
                                    requestFunctionFilePath = requestFunctionFilePath.replace(/\.js(x)?$/, '.ts$1');
                                    requestHookMakerFilePath = requestHookMakerFilePath.replace(/\.js(x)?$/, '.ts$1');
                                    if (!!syntheticalConfig.typesOnly) return [3 /*break*/, 7];
                                    return [4 /*yield*/, fs_extra_1.default.pathExists(rawRequestFunctionFilePath)];
                                case 1:
                                    if (!!(_c.sent())) return [3 /*break*/, 3];
                                    return [4 /*yield*/, fs_extra_1.default.outputFile(requestFunctionFilePath, vtils_1.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n                import { RequestFunctionParams } from 'yapi-to-typescript'\n\n                export interface RequestOptions {\n                  /**\n                   * \u4F7F\u7528\u7684\u670D\u52A1\u5668\u3002\n                   *\n                   * - `prod`: \u751F\u4EA7\u670D\u52A1\u5668\n                   * - `dev`: \u6D4B\u8BD5\u670D\u52A1\u5668\n                   * - `mock`: \u6A21\u62DF\u670D\u52A1\u5668\n                   *\n                   * @default prod\n                   */\n                  server?: 'prod' | 'dev' | 'mock',\n                }\n\n                export default function request<TResponseData>(\n                  payload: RequestFunctionParams,\n                  options: RequestOptions = {\n                    server: 'prod',\n                  },\n                ): Promise<TResponseData> {\n                  return new Promise<TResponseData>((resolve, reject) => {\n                    // \u57FA\u672C\u5730\u5740\n                    const baseUrl = options.server === 'mock'\n                      ? payload.mockUrl\n                      : options.server === 'dev'\n                        ? payload.devUrl\n                        : payload.prodUrl\n\n                    // \u8BF7\u6C42\u5730\u5740\n                    const url = `${baseUrl}${payload.path}`\n\n                    // \u5177\u4F53\u8BF7\u6C42\u903B\u8F91\n                  })\n                }\n              "], ["\n                import { RequestFunctionParams } from 'yapi-to-typescript'\n\n                export interface RequestOptions {\n                  /**\n                   * \u4F7F\u7528\u7684\u670D\u52A1\u5668\u3002\n                   *\n                   * - \\`prod\\`: \u751F\u4EA7\u670D\u52A1\u5668\n                   * - \\`dev\\`: \u6D4B\u8BD5\u670D\u52A1\u5668\n                   * - \\`mock\\`: \u6A21\u62DF\u670D\u52A1\u5668\n                   *\n                   * @default prod\n                   */\n                  server?: 'prod' | 'dev' | 'mock',\n                }\n\n                export default function request<TResponseData>(\n                  payload: RequestFunctionParams,\n                  options: RequestOptions = {\n                    server: 'prod',\n                  },\n                ): Promise<TResponseData> {\n                  return new Promise<TResponseData>((resolve, reject) => {\n                    // \u57FA\u672C\u5730\u5740\n                    const baseUrl = options.server === 'mock'\n                      ? payload.mockUrl\n                      : options.server === 'dev'\n                        ? payload.devUrl\n                        : payload.prodUrl\n\n                    // \u8BF7\u6C42\u5730\u5740\n                    const url = \\`\\${baseUrl}\\${payload.path}\\`\n\n                    // \u5177\u4F53\u8BF7\u6C42\u903B\u8F91\n                  })\n                }\n              "]))))];
                                case 2:
                                    _c.sent();
                                    _c.label = 3;
                                case 3:
                                    _b = syntheticalConfig.reactHooks &&
                                        syntheticalConfig.reactHooks.enabled;
                                    if (!_b) return [3 /*break*/, 5];
                                    return [4 /*yield*/, fs_extra_1.default.pathExists(rawRequestHookMakerFilePath)];
                                case 4:
                                    _b = !(_c.sent());
                                    _c.label = 5;
                                case 5:
                                    if (!_b) return [3 /*break*/, 7];
                                    return [4 /*yield*/, fs_extra_1.default.outputFile(requestHookMakerFilePath, vtils_1.dedent(templateObject_3 || (templateObject_3 = tslib_1.__makeTemplateObject(["\n                import { useState, useEffect } from 'react'\n                import { RequestConfig } from 'yapi-to-typescript'\n                import { Request } from ", "\n                import baseRequest from ", "\n\n                export default function makeRequestHook<TRequestData, TRequestConfig extends RequestConfig, TRequestResult extends ReturnType<typeof baseRequest>>(request: Request<TRequestData, TRequestConfig, TRequestResult>) {\n                  type Data = TRequestResult extends Promise<infer R> ? R : TRequestResult\n                  return function useRequest(requestData: TRequestData) {\n                    // \u4E00\u4E2A\u7B80\u5355\u7684 Hook \u5B9E\u73B0\uFF0C\u5B9E\u9645\u9879\u76EE\u53EF\u7ED3\u5408\u5176\u4ED6\u5E93\u4F7F\u7528\uFF0C\u6BD4\u5982\uFF1A\n                    // @umijs/hooks \u7684 useRequest (https://github.com/umijs/hooks)\n                    // swr (https://github.com/zeit/swr)\n\n                    const [loading, setLoading] = useState(true)\n                    const [data, setData] = useState<Data>()\n\n                    useEffect(() => {\n                      request(requestData).then(data => {\n                        setLoading(false)\n                        setData(data as any)\n                      })\n                    }, [JSON.stringify(requestData)])\n\n                    return {\n                      loading,\n                      data,\n                    }\n                  }\n                }\n              "], ["\n                import { useState, useEffect } from 'react'\n                import { RequestConfig } from 'yapi-to-typescript'\n                import { Request } from ",
                                            "\n                import baseRequest from ",
                                            "\n\n                export default function makeRequestHook<TRequestData, TRequestConfig extends RequestConfig, TRequestResult extends ReturnType<typeof baseRequest>>(request: Request<TRequestData, TRequestConfig, TRequestResult>) {\n                  type Data = TRequestResult extends Promise<infer R> ? R : TRequestResult\n                  return function useRequest(requestData: TRequestData) {\n                    // \u4E00\u4E2A\u7B80\u5355\u7684 Hook \u5B9E\u73B0\uFF0C\u5B9E\u9645\u9879\u76EE\u53EF\u7ED3\u5408\u5176\u4ED6\u5E93\u4F7F\u7528\uFF0C\u6BD4\u5982\uFF1A\n                    // @umijs/hooks \u7684 useRequest (https://github.com/umijs/hooks)\n                    // swr (https://github.com/zeit/swr)\n\n                    const [loading, setLoading] = useState(true)\n                    const [data, setData] = useState<Data>()\n\n                    useEffect(() => {\n                      request(requestData).then(data => {\n                        setLoading(false)\n                        setData(data as any)\n                      })\n                    }, [JSON.stringify(requestData)])\n\n                    return {\n                      loading,\n                      data,\n                    }\n                  }\n                }\n              "])), JSON.stringify(utils_1.getNormalizedRelativePath(requestHookMakerFilePath, outputFilePath)), JSON.stringify(utils_1.getNormalizedRelativePath(requestHookMakerFilePath, requestFunctionFilePath))))];
                                case 6:
                                    _c.sent();
                                    _c.label = 7;
                                case 7:
                                    rawOutputContent = vtils_1.dedent(templateObject_6 || (templateObject_6 = tslib_1.__makeTemplateObject(["\n          /* tslint:disable */\n          /* eslint-disable */\n\n          /* \u8BE5\u6587\u4EF6\u7531 yapi-to-typescript \u81EA\u52A8\u751F\u6210\uFF0C\u8BF7\u52FF\u76F4\u63A5\u4FEE\u6539\uFF01\uFF01\uFF01 */\n\n          ", "\n        "], ["\n          /* tslint:disable */\n          /* eslint-disable */\n\n          /* \u8BE5\u6587\u4EF6\u7531 yapi-to-typescript \u81EA\u52A8\u751F\u6210\uFF0C\u8BF7\u52FF\u76F4\u63A5\u4FEE\u6539\uFF01\uFF01\uFF01 */\n\n          ",
                                        "\n        "
                                        // ref: https://prettier.io/docs/en/options.html
                                    ])), syntheticalConfig.typesOnly
                                        ? content.join('\n\n').trim()
                                        : vtils_1.dedent(templateObject_5 || (templateObject_5 = tslib_1.__makeTemplateObject(["\n                // @ts-ignore\n                // prettier-ignore\n                import { Method, RequestBodyType, ResponseBodyType, RequestConfig, RequestFunctionRestArgs, FileData, prepare } from 'yapi-to-typescript'\n                // @ts-ignore\n                import request from ", "\n                ", "\n\n                // makeRequest\n                function makeRequestRequired<TReqeustData, TResponseData, TRequestConfig extends RequestConfig>(requestConfig: TRequestConfig) {\n                  const req = function (requestData: TReqeustData, ...args: RequestFunctionRestArgs<typeof request>) {\n                    return request<TResponseData>(prepare(requestConfig, requestData), ...args)\n                  }\n                  req.requestConfig = requestConfig\n                  return req\n                }\n                function makeRequestOptional<TReqeustData, TResponseData, TRequestConfig extends RequestConfig>(requestConfig: TRequestConfig) {\n                  const req = function (requestData?: TReqeustData, ...args: RequestFunctionRestArgs<typeof request>) {\n                    return request<TResponseData>(prepare(requestConfig, requestData), ...args)\n                  }\n                  req.requestConfig = requestConfig\n                  return req\n                }\n                function makeRequest<TReqeustData, TResponseData, TRequestConfig extends RequestConfig>(requestConfig: TRequestConfig) {\n                  const optional = makeRequestOptional<TReqeustData, TResponseData, TRequestConfig>(requestConfig)\n                  const required = makeRequestRequired<TReqeustData, TResponseData, TRequestConfig>(requestConfig)\n                  return (\n                      requestConfig.requestDataOptional\n                        ? optional\n                        : required\n                    ) as (\n                      TRequestConfig['requestDataOptional'] extends true\n                        ? typeof optional\n                        : typeof required\n                    )\n                }\n\n                // Request\n                export type Request<TReqeustData, TRequestConfig extends RequestConfig, TRequestResult> = (\n                  TRequestConfig['requestDataOptional'] extends true\n                    ? (requestData?: TReqeustData, ...args: RequestFunctionRestArgs<typeof request>) => TRequestResult\n                    : (requestData: TReqeustData, ...args: RequestFunctionRestArgs<typeof request>) => TRequestResult\n                ) & {\n                  requestConfig: TRequestConfig\n                }\n\n                ", "\n              "], ["\n                // @ts-ignore\n                // prettier-ignore\n                import { Method, RequestBodyType, ResponseBodyType, RequestConfig, RequestFunctionRestArgs, FileData, prepare } from 'yapi-to-typescript'\n                // @ts-ignore\n                import request from ",
                                            "\n                ",
                                            "\n\n                // makeRequest\n                function makeRequestRequired<TReqeustData, TResponseData, TRequestConfig extends RequestConfig>(requestConfig: TRequestConfig) {\n                  const req = function (requestData: TReqeustData, ...args: RequestFunctionRestArgs<typeof request>) {\n                    return request<TResponseData>(prepare(requestConfig, requestData), ...args)\n                  }\n                  req.requestConfig = requestConfig\n                  return req\n                }\n                function makeRequestOptional<TReqeustData, TResponseData, TRequestConfig extends RequestConfig>(requestConfig: TRequestConfig) {\n                  const req = function (requestData?: TReqeustData, ...args: RequestFunctionRestArgs<typeof request>) {\n                    return request<TResponseData>(prepare(requestConfig, requestData), ...args)\n                  }\n                  req.requestConfig = requestConfig\n                  return req\n                }\n                function makeRequest<TReqeustData, TResponseData, TRequestConfig extends RequestConfig>(requestConfig: TRequestConfig) {\n                  const optional = makeRequestOptional<TReqeustData, TResponseData, TRequestConfig>(requestConfig)\n                  const required = makeRequestRequired<TReqeustData, TResponseData, TRequestConfig>(requestConfig)\n                  return (\n                      requestConfig.requestDataOptional\n                        ? optional\n                        : required\n                    ) as (\n                      TRequestConfig['requestDataOptional'] extends true\n                        ? typeof optional\n                        : typeof required\n                    )\n                }\n\n                // Request\n                export type Request<TReqeustData, TRequestConfig extends RequestConfig, TRequestResult> = (\n                  TRequestConfig['requestDataOptional'] extends true\n                    ? (requestData?: TReqeustData, ...args: RequestFunctionRestArgs<typeof request>) => TRequestResult\n                    : (requestData: TReqeustData, ...args: RequestFunctionRestArgs<typeof request>) => TRequestResult\n                ) & {\n                  requestConfig: TRequestConfig\n                }\n\n                ", "\n              "])), JSON.stringify(utils_1.getNormalizedRelativePath(outputFilePath, requestFunctionFilePath)), !syntheticalConfig.reactHooks ||
                                            !syntheticalConfig.reactHooks.enabled
                                            ? ''
                                            : vtils_1.dedent(templateObject_4 || (templateObject_4 = tslib_1.__makeTemplateObject(["\n                      // @ts-ignore\n                      import makeRequestHook from ", "\n                    "], ["\n                      // @ts-ignore\n                      import makeRequestHook from ",
                                                "\n                    "])), JSON.stringify(utils_1.getNormalizedRelativePath(outputFilePath, requestHookMakerFilePath))), content.join('\n\n').trim()));
                                    prettyOutputContent = prettier_1.default.format(rawOutputContent, {
                                        parser: 'typescript',
                                        printWidth: 120,
                                        tabWidth: 2,
                                        singleQuote: true,
                                        semi: false,
                                        trailingComma: 'all',
                                        bracketSpacing: false,
                                        endOfLine: 'lf',
                                    });
                                    outputContent = vtils_1.dedent(templateObject_7 || (templateObject_7 = tslib_1.__makeTemplateObject(["\n          /* prettier-ignore-start */\n          ", "\n          /* prettier-ignore-end */\n        "], ["\n          /* prettier-ignore-start */\n          ", "\n          /* prettier-ignore-end */\n        "])), prettyOutputContent) + "\n";
                                    return [4 /*yield*/, fs_extra_1.default.outputFile(outputFilePath, outputContent)
                                        // 如果要生成 JavaScript 代码，
                                        // 则先对主文件进行 tsc 编译，主文件引用到的其他文件也会被编译，
                                        // 然后，删除原始的 .tsx? 文件。
                                    ];
                                case 8:
                                    _c.sent();
                                    if (!(syntheticalConfig.target === 'javascript')) return [3 /*break*/, 11];
                                    return [4 /*yield*/, this.tsc(outputFilePath)];
                                case 9:
                                    _c.sent();
                                    return [4 /*yield*/, Promise.all([
                                            fs_extra_1.default.remove(requestFunctionFilePath).catch(vtils_1.noop),
                                            fs_extra_1.default.remove(requestHookMakerFilePath).catch(vtils_1.noop),
                                            fs_extra_1.default.remove(outputFilePath).catch(vtils_1.noop),
                                        ])];
                                case 10:
                                    _c.sent();
                                    _c.label = 11;
                                case 11: return [2 /*return*/];
                            }
                        });
                    }); }))];
            });
        });
    };
    Generator.prototype.tsc = function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        child_process_1.exec(require.resolve('typescript/bin/tsc') + " --target ES2019 --module ESNext --jsx preserve --declaration --esModuleInterop " + file, {
                            cwd: _this.options.cwd,
                            env: process.env,
                        }, function () { return resolve(); });
                    })];
            });
        });
    };
    /** 生成请求数据类型 */
    Generator.prototype.generateRequestDataType = function (_a) {
        var interfaceInfo = _a.interfaceInfo, typeName = _a.typeName;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var jsonSchema, paramsJsonSchema;
            return tslib_1.__generator(this, function (_b) {
                switch (interfaceInfo.method) {
                    case types_1.Method.GET:
                    case types_1.Method.HEAD:
                    case types_1.Method.OPTIONS:
                        jsonSchema = utils_1.propDefinitionsToJsonSchema(interfaceInfo.req_query.map(function (item) { return ({
                            name: item.name,
                            required: item.required === types_1.Required.true,
                            type: ['string', 'number', 'boolean'],
                            comment: item.desc,
                        }); }));
                        if (Object.keys(jsonSchema.properties).length > 0) {
                            jsonSchema.additionalProperties = true;
                        }
                        break;
                    default:
                        switch (interfaceInfo.req_body_type) {
                            case types_1.RequestBodyType.form:
                                jsonSchema = utils_1.propDefinitionsToJsonSchema(interfaceInfo.req_body_form.map(function (item) { return ({
                                    name: item.name,
                                    required: item.required === types_1.Required.true,
                                    type: (item.type === types_1.RequestFormItemType.file
                                        ? 'file'
                                        : 'string'),
                                    comment: item.desc,
                                }); }));
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
                    paramsJsonSchema = utils_1.propDefinitionsToJsonSchema(interfaceInfo.req_params.map(function (item) { return ({
                        name: item.name,
                        required: true,
                        type: 'string',
                        comment: item.desc,
                    }); }));
                    /* istanbul ignore else */
                    if (jsonSchema) {
                        jsonSchema.properties = tslib_1.__assign(tslib_1.__assign({}, jsonSchema.properties), paramsJsonSchema.properties);
                        jsonSchema.required = tslib_1.__spreadArrays((jsonSchema.required || []), (paramsJsonSchema.required || []));
                    }
                    else {
                        jsonSchema = paramsJsonSchema;
                    }
                }
                return [2 /*return*/, utils_1.jsonSchemaToType(jsonSchema, typeName)];
            });
        });
    };
    /** 生成响应数据类型 */
    Generator.prototype.generateResponseDataType = function (_a) {
        var interfaceInfo = _a.interfaceInfo, typeName = _a.typeName, dataKey = _a.dataKey;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var jsonSchema, json, type, required, key, required_1, key, required, key;
            return tslib_1.__generator(this, function (_b) {
                jsonSchema = {};
                switch (interfaceInfo.res_body_type) {
                    case types_1.ResponseBodyType.json:
                        if (interfaceInfo.res_body) {
                            json = JSON.parse(interfaceInfo.res_body);
                            if (json.properties && json.properties.data) {
                                type = json.properties.data.type;
                                if (type === "array") {
                                    required = [];
                                    for (key in json.properties.data.items.properties) {
                                        required.push(key);
                                    }
                                    json.properties.data.items.required = required;
                                }
                                if (type === "object") {
                                    if (json.properties.data.properties && json.properties.data.properties.content && json.properties.data.properties.content.type === 'array') {
                                        required_1 = [];
                                        for (key in json.properties.data.properties.content.items.properties) {
                                            required_1.push(key);
                                        }
                                        json.properties.data.properties.content.items.required = required_1;
                                    }
                                    required = [];
                                    for (key in json.properties.data.properties) {
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
                        return [2 /*return*/, "export type " + typeName + " = any"];
                }
                /* istanbul ignore if */
                if (dataKey &&
                    jsonSchema &&
                    jsonSchema.properties &&
                    jsonSchema.properties[dataKey]) {
                    jsonSchema = jsonSchema.properties[dataKey];
                }
                return [2 /*return*/, utils_1.jsonSchemaToType(jsonSchema, typeName)];
            });
        });
    };
    Generator.prototype.fetchApi = function (url, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, got_1.default.get(url, {
                            searchParams: query,
                            responseType: 'json',
                        })
                        /* istanbul ignore next */
                    ];
                    case 1:
                        res = (_a.sent()).body;
                        /* istanbul ignore next */
                        if (res && res.errcode) {
                            utils_1.throwError(res.errmsg);
                        }
                        return [2 /*return*/, res.data || res];
                }
            });
        });
    };
    /** 获取分类的接口列表 */
    Generator.prototype.fetchInterfaceList = function (_a) {
        var serverUrl = _a.serverUrl, token = _a.token, id = _a.id;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var category;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.fetchExport({ serverUrl: serverUrl, token: token })];
                    case 1:
                        category = ((_b.sent()) || []).find(function (cat) { return !vtils_1.isEmpty(cat) && !vtils_1.isEmpty(cat.list) && cat.list[0].catid === id; });
                        if (category) {
                            category.list.forEach(function (interfaceInfo) {
                                // 实现 _category 字段
                                interfaceInfo._category = vtils_1.omit(category, ['list']);
                            });
                        }
                        return [2 /*return*/, category ? category.list : []];
                }
            });
        });
    };
    /** 获取项目信息 */
    Generator.prototype.fetchProjectInfo = function (syntheticalConfig) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var projectInfo, projectCats;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchProject(syntheticalConfig)];
                    case 1:
                        projectInfo = _a.sent();
                        return [4 /*yield*/, this.fetchApi(syntheticalConfig.serverUrl + "/api/interface/getCatMenu", {
                                token: syntheticalConfig.token,
                                project_id: projectInfo._id,
                            })];
                    case 2:
                        projectCats = _a.sent();
                        return [2 /*return*/, tslib_1.__assign(tslib_1.__assign({}, projectInfo), { cats: projectCats, getMockUrl: function () {
                                    return syntheticalConfig.serverUrl + "/mock/" + projectInfo._id;
                                }, getDevUrl: function (devEnvName) {
                                    var env = projectInfo.env.find(function (e) { return e.name === devEnvName; });
                                    return (env && env.domain) /* istanbul ignore next */ || '';
                                }, getProdUrl: function (prodEnvName) {
                                    var env = projectInfo.env.find(function (e) { return e.name === prodEnvName; });
                                    return (env && env.domain) /* istanbul ignore next */ || '';
                                } })];
                }
            });
        });
    };
    /** 生成接口代码 */
    Generator.prototype.generateInterfaceCode = function (syntheticalConfig, interfaceInfo, categoryUID) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var extendedInterfaceInfo, requestFunctionName, _a, requestConfigName, requestConfigTypeName, requestDataTypeName, _b, responseDataTypeName, _c, requestDataType, responseDataType, isRequestDataOptional, requestHookName, _d, _e, paramNames, paramNamesLiteral, paramNameType, queryNames, queryNamesLiteral, queryNameType, escapedTitle, interfaceTitle, interfaceSummary, interfaceExtraComments;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        extendedInterfaceInfo = tslib_1.__assign(tslib_1.__assign({}, interfaceInfo), { parsedPath: path_1.default.parse(interfaceInfo.path) });
                        if (!vtils_1.isFunction(syntheticalConfig.getRequestFunctionName)) return [3 /*break*/, 2];
                        return [4 /*yield*/, syntheticalConfig.getRequestFunctionName(extendedInterfaceInfo, changeCase)];
                    case 1:
                        _a = _f.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = changeCase.camelCase(interfaceInfo.parsedPath.name);
                        _f.label = 3;
                    case 3:
                        requestFunctionName = _a;
                        requestConfigName = changeCase.camelCase(requestFunctionName + "RequestConfig");
                        requestConfigTypeName = changeCase.pascalCase(requestConfigName);
                        if (!vtils_1.isFunction(syntheticalConfig.getRequestDataTypeName)) return [3 /*break*/, 5];
                        return [4 /*yield*/, syntheticalConfig.getRequestDataTypeName(extendedInterfaceInfo, changeCase)];
                    case 4:
                        _b = _f.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        _b = changeCase.pascalCase(requestFunctionName + "Request");
                        _f.label = 6;
                    case 6:
                        requestDataTypeName = _b;
                        if (!vtils_1.isFunction(syntheticalConfig.getResponseDataTypeName)) return [3 /*break*/, 8];
                        return [4 /*yield*/, syntheticalConfig.getResponseDataTypeName(extendedInterfaceInfo, changeCase)];
                    case 7:
                        _c = _f.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        _c = changeCase.pascalCase(requestFunctionName + "Response");
                        _f.label = 9;
                    case 9:
                        responseDataTypeName = _c;
                        return [4 /*yield*/, this.generateRequestDataType({
                                interfaceInfo: interfaceInfo,
                                typeName: requestDataTypeName,
                            })];
                    case 10:
                        requestDataType = _f.sent();
                        return [4 /*yield*/, this.generateResponseDataType({
                                interfaceInfo: interfaceInfo,
                                typeName: responseDataTypeName,
                                dataKey: syntheticalConfig.dataKey,
                            })];
                    case 11:
                        responseDataType = _f.sent();
                        isRequestDataOptional = /(\{\}|any)$/s.test(requestDataType);
                        if (!(syntheticalConfig.reactHooks && syntheticalConfig.reactHooks.enabled)) return [3 /*break*/, 15];
                        if (!vtils_1.isFunction(syntheticalConfig.reactHooks.getRequestHookName)) return [3 /*break*/, 13];
                        return [4 /*yield*/, syntheticalConfig.reactHooks.getRequestHookName(extendedInterfaceInfo, changeCase)];
                    case 12:
                        _e = _f.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        _e = "use" + changeCase.pascalCase(requestFunctionName);
                        _f.label = 14;
                    case 14:
                        _d = _e;
                        return [3 /*break*/, 16];
                    case 15:
                        _d = '';
                        _f.label = 16;
                    case 16:
                        requestHookName = _d;
                        paramNames = (interfaceInfo.req_params /* istanbul ignore next */ || []).map(function (item) { return item.name; });
                        paramNamesLiteral = JSON.stringify(paramNames);
                        paramNameType = paramNames.length === 0 ? 'string' : "'" + paramNames.join("' | '") + "'";
                        queryNames = (interfaceInfo.req_query /* istanbul ignore next */ || []).map(function (item) { return item.name; });
                        queryNamesLiteral = JSON.stringify(queryNames);
                        queryNameType = queryNames.length === 0 ? 'string' : "'" + queryNames.join("' | '") + "'";
                        escapedTitle = String(interfaceInfo.title).replace(/\//g, '\\/');
                        interfaceTitle = "[" + escapedTitle + "\u2197](" + syntheticalConfig.serverUrl + "/project/" + interfaceInfo.project_id + "/interface/api/" + interfaceInfo._id + ")";
                        interfaceSummary = [
                            {
                                label: '分类',
                                value: "[" + interfaceInfo._category.name + "\u2197](" + syntheticalConfig.serverUrl + "/project/" + interfaceInfo.project_id + "/interface/api/cat_" + interfaceInfo.catid + ")",
                            },
                            {
                                label: '标签',
                                value: interfaceInfo.tag.map(function (tag) { return "`" + tag + "`"; }),
                            },
                            {
                                label: '请求头',
                                value: "`" + interfaceInfo.method.toUpperCase() + " " + interfaceInfo.path + "`",
                            },
                            {
                                label: '更新时间',
                                value: process.env.JEST_WORKER_ID // 测试时使用 unix 时间戳
                                    ? String(interfaceInfo.up_time)
                                    : /* istanbul ignore next */
                                        "`" + dayjs_1.default(interfaceInfo.up_time * 1000).format('YYYY-MM-DD HH:mm:ss') + "`",
                            },
                        ];
                        interfaceExtraComments = interfaceSummary
                            .filter(function (item) { return !vtils_1.isEmpty(item.value); })
                            .map(function (item) { return "* @" + item.label + " " + vtils_1.castArray(item.value).join(', '); })
                            .join('\n');
                        return [2 /*return*/, vtils_1.dedent(templateObject_10 || (templateObject_10 = tslib_1.__makeTemplateObject(["\n      /**\n       * \u63A5\u53E3 ", " \u7684 **\u8BF7\u6C42\u7C7B\u578B**\n       *\n       ", "\n       */\n      ", "\n\n      /**\n       * \u63A5\u53E3 ", " \u7684 **\u8FD4\u56DE\u7C7B\u578B**\n       *\n       ", "\n       */\n      ", "\n\n      ", "\n    "], ["\n      /**\n       * \u63A5\u53E3 ", " \u7684 **\u8BF7\u6C42\u7C7B\u578B**\n       *\n       ", "\n       */\n      ", "\n\n      /**\n       * \u63A5\u53E3 ", " \u7684 **\u8FD4\u56DE\u7C7B\u578B**\n       *\n       ", "\n       */\n      ", "\n\n      ",
                                "\n    "])), interfaceTitle, interfaceExtraComments, requestDataType.trim(), interfaceTitle, interfaceExtraComments, responseDataType.trim(), syntheticalConfig.typesOnly
                                ? ''
                                : vtils_1.dedent(templateObject_9 || (templateObject_9 = tslib_1.__makeTemplateObject(["\n            /**\n             * \u63A5\u53E3 ", " \u7684 **\u8BF7\u6C42\u914D\u7F6E\u7684\u7C7B\u578B**\n             *\n             ", "\n             */\n            type ", " = Readonly<RequestConfig<\n              ", ",\n              ", ",\n              ", ",\n              ", ",\n              ", ",\n              ", ",\n              ", ",\n              ", "\n            >>\n\n            /**\n             * \u63A5\u53E3 ", " \u7684 **\u8BF7\u6C42\u914D\u7F6E**\n             *\n             ", "\n             */\n            const ", ": ", " = {\n              mockUrl: mockUrl", ",\n              devUrl: devUrl", ",\n              prodUrl: prodUrl", ",\n              path: ", ",\n              method: Method.", ",\n              requestBodyType: RequestBodyType.", ",\n              responseBodyType: ResponseBodyType.", ",\n              dataKey: dataKey", ",\n              paramNames: ", ",\n              queryNames: ", ",\n              requestDataOptional: ", ",\n            }\n\n            /**\n             * \u63A5\u53E3 ", " \u7684 **\u8BF7\u6C42\u51FD\u6570**\n             *\n             ", "\n             */\n            export const ", " = makeRequest<", ", ", ", ", ">(", ")\n\n            ", "\n          "], ["\n            /**\n             * \u63A5\u53E3 ", " \u7684 **\u8BF7\u6C42\u914D\u7F6E\u7684\u7C7B\u578B**\n             *\n             ", "\n             */\n            type ", " = Readonly<RequestConfig<\n              ", ",\n              ", ",\n              ", ",\n              ", ",\n              ", ",\n              ", ",\n              ", ",\n              ", "\n            >>\n\n            /**\n             * \u63A5\u53E3 ", " \u7684 **\u8BF7\u6C42\u914D\u7F6E**\n             *\n             ", "\n             */\n            const ", ": ", " = {\n              mockUrl: mockUrl", ",\n              devUrl: devUrl", ",\n              prodUrl: prodUrl", ",\n              path: ", ",\n              method: Method.", ",\n              requestBodyType: RequestBodyType.",
                                    ",\n              responseBodyType: ResponseBodyType.", ",\n              dataKey: dataKey", ",\n              paramNames: ", ",\n              queryNames: ", ",\n              requestDataOptional: ", ",\n            }\n\n            /**\n             * \u63A5\u53E3 ", " \u7684 **\u8BF7\u6C42\u51FD\u6570**\n             *\n             ", "\n             */\n            export const ", " = makeRequest<", ", ", ", ", ">(", ")\n\n            ",
                                    "\n          "])), interfaceTitle, interfaceExtraComments, requestConfigTypeName, JSON.stringify(syntheticalConfig.mockUrl), JSON.stringify(syntheticalConfig.devUrl), JSON.stringify(syntheticalConfig.prodUrl), JSON.stringify(interfaceInfo.path), JSON.stringify(syntheticalConfig.dataKey) || 'undefined', paramNameType, queryNameType, JSON.stringify(isRequestDataOptional), interfaceTitle, interfaceExtraComments, requestConfigName, requestConfigTypeName, categoryUID, categoryUID, categoryUID, JSON.stringify(interfaceInfo.path), interfaceInfo.method, interfaceInfo.method === types_1.Method.GET
                                    ? types_1.RequestBodyType.query
                                    : interfaceInfo.req_body_type /* istanbul ignore next */ ||
                                        types_1.RequestBodyType.none, interfaceInfo.res_body_type, categoryUID, paramNamesLiteral, queryNamesLiteral, JSON.stringify(isRequestDataOptional), interfaceTitle, interfaceExtraComments, requestFunctionName, requestDataTypeName, responseDataTypeName, requestConfigTypeName, requestConfigName, !syntheticalConfig.reactHooks ||
                                    !syntheticalConfig.reactHooks.enabled
                                    ? ''
                                    : vtils_1.dedent(templateObject_8 || (templateObject_8 = tslib_1.__makeTemplateObject(["\n                  /**\n                   * \u63A5\u53E3 ", " \u7684 **React Hook**\n                   *\n                   ", "\n                   */\n                  export const ", " = makeRequestHook<", ", ", ", ReturnType<typeof ", ">>(", ")\n                "], ["\n                  /**\n                   * \u63A5\u53E3 ", " \u7684 **React Hook**\n                   *\n                   ", "\n                   */\n                  export const ", " = makeRequestHook<", ", ", ", ReturnType<typeof ", ">>(", ")\n                "])), interfaceTitle, interfaceExtraComments, requestHookName, requestDataTypeName, requestConfigTypeName, requestFunctionName, requestFunctionName)))];
                }
            });
        });
    };
    return Generator;
}());
exports.Generator = Generator;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
