/** 请求方式 */
export var Method;
(function (Method) {
    Method["GET"] = "GET";
    Method["POST"] = "POST";
    Method["PUT"] = "PUT";
    Method["DELETE"] = "DELETE";
    Method["HEAD"] = "HEAD";
    Method["OPTIONS"] = "OPTIONS";
    Method["PATCH"] = "PATCH";
})(Method || (Method = {}));
/** 是否必需 */
export var Required;
(function (Required) {
    /** 不必需 */
    Required["false"] = "0";
    /** 必需 */
    Required["true"] = "1";
})(Required || (Required = {}));
/** 请求数据类型 */
export var RequestBodyType;
(function (RequestBodyType) {
    /** 查询字符串 */
    RequestBodyType["query"] = "query";
    /** 表单 */
    RequestBodyType["form"] = "form";
    /** JSON */
    RequestBodyType["json"] = "json";
    /** 纯文本 */
    RequestBodyType["text"] = "text";
    /** 文件 */
    RequestBodyType["file"] = "file";
    /** 原始数据 */
    RequestBodyType["raw"] = "raw";
    /** 无请求数据 */
    RequestBodyType["none"] = "none";
})(RequestBodyType || (RequestBodyType = {}));
/** 请求表单条目类型 */
export var RequestFormItemType;
(function (RequestFormItemType) {
    /** 纯文本 */
    RequestFormItemType["text"] = "text";
    /** 文件 */
    RequestFormItemType["file"] = "file";
})(RequestFormItemType || (RequestFormItemType = {}));
/** 返回数据类型 */
export var ResponseBodyType;
(function (ResponseBodyType) {
    /** JSON */
    ResponseBodyType["json"] = "json";
    /** 纯文本 */
    ResponseBodyType["text"] = "text";
    /** XML */
    ResponseBodyType["xml"] = "xml";
    /** 原始数据 */
    ResponseBodyType["raw"] = "raw";
    // yapi 实际上返回的是 json，有另外的字段指示其是否是 json schema
    /** JSON Schema */
    // jsonSchema = 'json-schema',
})(ResponseBodyType || (ResponseBodyType = {}));
