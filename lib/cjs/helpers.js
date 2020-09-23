"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare = exports.parseRequestData = exports.FileData = exports.defineConfig = void 0;
var tslib_1 = require("tslib");
/**
 * 定义配置。
 *
 * @param config 配置
 */
function defineConfig(config) {
    return config;
}
exports.defineConfig = defineConfig;
var FileData = /** @class */ (function () {
    /**
     * 文件数据辅助类，统一网页、小程序等平台的文件上传。
     *
     * @param originalFileData 原始文件数据
     */
    function FileData(originalFileData) {
        this.originalFileData = originalFileData;
    }
    /**
     * 获取原始文件数据。
     *
     * @returns 原始文件数据
     */
    FileData.prototype.getOriginalFileData = function () {
        return this.originalFileData;
    };
    return FileData;
}());
exports.FileData = FileData;
/**
 * 解析请求数据，从请求数据中分离出普通数据和文件数据。
 *
 * @param [requestData] 要解析的请求数据
 * @returns 包含普通数据(data)和文件数据(fileData)的对象，data、fileData 为空对象时，表示没有此类数据
 */
function parseRequestData(requestData) {
    var result = {
        data: {},
        fileData: {},
    };
    /* istanbul ignore else */
    if (requestData != null) {
        if (typeof requestData === 'object' && !Array.isArray(requestData)) {
            Object.keys(requestData).forEach(function (key) {
                if (requestData[key] && requestData[key] instanceof FileData) {
                    result.fileData[key] = requestData[key].getOriginalFileData();
                }
                else {
                    result.data[key] = requestData[key];
                }
            });
        }
        else {
            result.data = requestData;
        }
    }
    return result;
}
exports.parseRequestData = parseRequestData;
/**
 * 准备要传给请求函数的参数。
 */
function prepare(requestConfig, requestData) {
    var requestPath = requestConfig.path;
    var _a = parseRequestData(requestData), data = _a.data, fileData = _a.fileData;
    if (data != null && typeof data === 'object' && !Array.isArray(data)) {
        // 替换路径参数
        if (Array.isArray(requestConfig.paramNames) &&
            requestConfig.paramNames.length > 0) {
            Object.keys(data).forEach(function (key) {
                if (requestConfig.paramNames.indexOf(key) >= 0) {
                    // ref: https://github.com/YMFE/yapi/blob/master/client/containers/Project/Interface/InterfaceList/InterfaceEditForm.js#L465
                    requestPath = requestPath
                        .replace(new RegExp("\\{" + key + "\\}", 'g'), data[key])
                        .replace(new RegExp("/:" + key + "(?=/|$)", 'g'), "/" + data[key]);
                    delete data[key];
                }
            });
        }
        // 追加查询参数到路径上
        var queryString_1 = '';
        if (Array.isArray(requestConfig.queryNames) &&
            requestConfig.queryNames.length > 0) {
            Object.keys(data).forEach(function (key) {
                if (requestConfig.queryNames.indexOf(key) >= 0) {
                    if (data[key] != null) {
                        queryString_1 += "" + (queryString_1 ? '&' : '') + encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
                    }
                    delete data[key];
                }
            });
        }
        if (queryString_1) {
            requestPath += "" + (requestPath.indexOf('?') > -1 ? '&' : '?') + queryString_1;
        }
    }
    return tslib_1.__assign(tslib_1.__assign({}, requestConfig), { path: requestPath, data: data, hasFileData: fileData && Object.keys(fileData).length > 0, fileData: fileData });
}
exports.prepare = prepare;
