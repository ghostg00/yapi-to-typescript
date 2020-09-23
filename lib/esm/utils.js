import { __assign, __awaiter, __generator } from "tslib";
import Mock from 'mockjs';
import path from 'path';
import toJsonSchema from 'to-json-schema';
import { castArray, forOwn, isArray, isEmpty, isObject } from 'vtils';
import { compile } from 'json-schema-to-typescript';
import { FileData } from './helpers';
/**
 * 抛出错误。
 *
 * @param msg 错误信息
 */
export function throwError() {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i] = arguments[_i];
    }
    /* istanbul ignore next */
    throw new Error(msg.join(''));
}
/**
 * 将路径统一为 unix 风格的路径。
 *
 * @param path 路径
 * @returns unix 风格的路径
 */
export function toUnixPath(path) {
    return path.replace(/[/\\]+/g, '/');
}
/**
 * 获得规范化的相对路径。
 *
 * @param from 来源路径
 * @param to 去向路径
 * @returns 相对路径
 */
export function getNormalizedRelativePath(from, to) {
    return toUnixPath(path.relative(path.dirname(from), to))
        .replace(/^(?=[^.])/, './')
        .replace(/\.(ts|js)x?$/i, '');
}
/**
 * 原地处理 JSONSchema。
 *
 * @param jsonSchema 待处理的 JSONSchema
 * @returns 处理后的 JSONSchema
 */
export function processJsonSchema(jsonSchema) {
    /* istanbul ignore if */
    if (!isObject(jsonSchema))
        return jsonSchema;
    // 去除 title 和 id，防止 json-schema-to-typescript 提取它们作为接口名
    delete jsonSchema.title;
    delete jsonSchema.id;
    // 忽略数组长度限制
    delete jsonSchema.minItems;
    delete jsonSchema.maxItems;
    // 将 additionalProperties 设为 false
    jsonSchema.additionalProperties = false;
    // 删除通过 swagger 导入时未剔除的 ref
    delete jsonSchema.$ref;
    delete jsonSchema.$$ref;
    // Mock.toJSONSchema 产生的 properties 为数组，然而 JSONSchema4 的 properties 为对象
    if (isArray(jsonSchema.properties)) {
        jsonSchema.properties = jsonSchema.properties.reduce(function (props, js) {
            props[js.name] = js;
            return props;
        }, {});
    }
    // 移除字段名称首尾空格
    if (jsonSchema.properties) {
        forOwn(jsonSchema.properties, function (_, prop) {
            var propDef = jsonSchema.properties[prop];
            delete jsonSchema.properties[prop];
            jsonSchema.properties[prop.trim()] = propDef;
        });
        jsonSchema.required =
            jsonSchema.required && jsonSchema.required.map(function (prop) { return prop.trim(); });
    }
    // 继续处理对象的子元素
    if (jsonSchema.properties) {
        forOwn(jsonSchema.properties, processJsonSchema);
    }
    // 继续处理数组的子元素
    if (jsonSchema.items) {
        castArray(jsonSchema.items).forEach(processJsonSchema);
    }
    return jsonSchema;
}
/**
 * 将 JSONSchema 字符串转为 JSONSchema 对象。
 *
 * @param str 要转换的 JSONSchema 字符串
 * @returns 转换后的 JSONSchema 对象
 */
export function jsonSchemaStringToJsonSchema(str) {
    return processJsonSchema(JSON.parse(str));
}
/**
 * 获得 JSON 数据的 JSONSchema 对象。
 *
 * @param json JSON 数据
 * @returns JSONSchema 对象
 */
export function jsonToJsonSchema(json) {
    var schema = toJsonSchema(json, {
        required: false,
        arrays: {
            mode: 'first',
        },
        objects: {
            additionalProperties: false,
        },
        strings: {
            detectFormat: false,
        },
        postProcessFnc: function (type, schema, value) {
            if (!schema.description && !!value && type !== 'object') {
                schema.description = JSON.stringify(value);
            }
            return schema;
        },
    });
    delete schema.description;
    return processJsonSchema(schema);
}
/**
 * 获得 mockjs 模板的 JSONSchema 对象。
 *
 * @param template mockjs 模板
 * @returns JSONSchema 对象
 */
export function mockjsTemplateToJsonSchema(template) {
    return processJsonSchema(Mock.toJSONSchema(template));
}
/**
 * 获得属性定义列表的 JSONSchema 对象。
 *
 * @param propDefinitions 属性定义列表
 * @returns JSONSchema 对象
 */
export function propDefinitionsToJsonSchema(propDefinitions) {
    return processJsonSchema({
        type: 'object',
        required: propDefinitions.reduce(function (res, prop) {
            if (prop.required) {
                res.push(prop.name);
            }
            return res;
        }, []),
        properties: propDefinitions.reduce(function (res, prop) {
            res[prop.name] = __assign({ type: prop.type, description: prop.comment }, (prop.type === 'file' ? { tsType: FileData.name } : {}));
            return res;
        }, {}),
    });
}
var JSTTOptions = {
    bannerComment: '',
    style: {
        bracketSpacing: false,
        printWidth: 120,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'none',
        useTabs: false,
    },
};
/**
 * 根据 JSONSchema 对象生产 TypeScript 类型定义。
 *
 * @param jsonSchema JSONSchema 对象
 * @param typeName 类型名称
 * @returns TypeScript 类型定义
 */
export function jsonSchemaToType(jsonSchema, typeName) {
    return __awaiter(this, void 0, void 0, function () {
        var fakeTypeName, code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isEmpty(jsonSchema)) {
                        return [2 /*return*/, "export interface " + typeName + " {}"];
                    }
                    fakeTypeName = 'THISISAFAKETYPENAME';
                    return [4 /*yield*/, compile(jsonSchema, fakeTypeName, JSTTOptions)];
                case 1:
                    code = _a.sent();
                    return [2 /*return*/, code.replace(fakeTypeName, typeName).trim()];
            }
        });
    });
}
