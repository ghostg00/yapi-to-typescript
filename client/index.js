'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/** 请求方式 */

(function (Method) {
  Method["GET"] = "GET";
  Method["POST"] = "POST";
  Method["PUT"] = "PUT";
  Method["DELETE"] = "DELETE";
  Method["HEAD"] = "HEAD";
  Method["OPTIONS"] = "OPTIONS";
  Method["PATCH"] = "PATCH";
})(exports.Method || (exports.Method = {}));

(function (Required) {
  /** 不必需 */
  Required["false"] = "0";
  /** 必需 */

  Required["true"] = "1";
})(exports.Required || (exports.Required = {}));

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
})(exports.RequestBodyType || (exports.RequestBodyType = {}));

(function (RequestFormItemType) {
  /** 纯文本 */
  RequestFormItemType["text"] = "text";
  /** 文件 */

  RequestFormItemType["file"] = "file";
})(exports.RequestFormItemType || (exports.RequestFormItemType = {}));

(function (ResponseBodyType) {
  /** JSON */
  ResponseBodyType["json"] = "json";
  /** 纯文本 */

  ResponseBodyType["text"] = "text";
  /** XML */

  ResponseBodyType["xml"] = "xml";
  /** 原始数据 */

  ResponseBodyType["raw"] = "raw"; // yapi 实际上返回的是 json，有另外的字段指示其是否是 json schema

  /** JSON Schema */
  // jsonSchema = 'json-schema',
})(exports.ResponseBodyType || (exports.ResponseBodyType = {}));

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var FileData =
/*#__PURE__*/
function () {
  /**
   * 文件数据辅助类，统一网页、小程序等平台的文件上传。
   *
   * @param originalFileData 原始文件数据
   */
  function FileData(originalFileData) {
    _classCallCheck(this, FileData);

    this.originalFileData = originalFileData;
  }
  /**
   * 获取原始文件数据。
   *
   * @returns 原始文件数据
   */


  _createClass(FileData, [{
    key: "getOriginalFileData",
    value: function getOriginalFileData() {
      return this.originalFileData;
    }
  }]);

  return FileData;
}();
/**
 * 解析请求数据，从请求数据中分离出普通数据和文件数据。
 *
 * @param [requestData] 要解析的请求数据
 * @returns 包含普通数据(data)和文件数据(fileData)的对象，data、fileData 为空对象时，表示没有此类数据
 */

function parseRequestData(requestData) {
  var result = {
    data: {},
    fileData: {}
  };

  if (requestData != null) {
    if (_typeof(requestData) === 'object' && !Array.isArray(requestData)) {
      Object.keys(requestData).forEach(function (key) {
        if (requestData[key] && requestData[key] instanceof FileData) {
          result.fileData[key] = requestData[key].getOriginalFileData();
        } else {
          result.data[key] = requestData[key];
        }
      });
    } else {
      result.data = requestData;
    }
  }

  return result;
}
/**
 * 准备要传给请求函数的参数。
 */

function prepare(requestConfig, requestData) {
  var requestPath = requestConfig.path;

  var _parseRequestData = parseRequestData(requestData),
      data = _parseRequestData.data,
      fileData = _parseRequestData.fileData;

  if (Array.isArray(requestConfig.paramNames) && requestConfig.paramNames.length > 0 && data != null && _typeof(data) === 'object' && !Array.isArray(data)) {
    Object.keys(data).forEach(function (key) {
      if (requestConfig.paramNames.indexOf(key) >= 0) {
        // ref: https://github.com/YMFE/yapi/blob/master/client/containers/Project/Interface/InterfaceList/InterfaceEditForm.js#L465
        requestPath = requestPath.replace(new RegExp("\\{".concat(key, "\\}"), 'g'), data[key]).replace(new RegExp("/:".concat(key, "(?=/|$)"), 'g'), "/".concat(data[key]));
        delete data[key];
      }
    });
  }

  return Object.assign({}, requestConfig, {
    path: requestPath,
    data: data,
    fileData: fileData
  });
}

function createApiHook(_ref) {
  var useState = _ref.useState,
      useEffect = _ref.useEffect,
      requestFunction = _ref.requestFunction,
      autoTrigger = _ref.autoTrigger;

  var useApi = function useApi(requestData) {
    var _useState = useState(null),
        _useState2 = _slicedToArray(_useState, 2),
        data = _useState2[0],
        setData = _useState2[1];

    var _useState3 = useState(!!autoTrigger),
        _useState4 = _slicedToArray(_useState3, 2),
        loading = _useState4[0],
        setLoading = _useState4[1];

    var _useState5 = useState(null),
        _useState6 = _slicedToArray(_useState5, 2),
        error = _useState6[0],
        setError = _useState6[1];

    var request = function request(requestData, callback, noChangeLoading) {
      if (!noChangeLoading) {
        setLoading(true);
      }

      (requestData == null ? requestFunction() : requestFunction(requestData)).then(function (data) {
        if (error != null) {
          setError(null);
        }

        setData(data);

        if (typeof callback === 'function') {
          callback();
        }
      }, function (error) {
        return setError(error);
      }).then(function () {
        if (!noChangeLoading) {
          setLoading(false);
        }
      });
    };

    if (autoTrigger) {
      var requestDataIsFunction = typeof requestData === 'function';

      var _requestData = requestDataIsFunction ? requestData() : requestData;

      var hash = JSON.stringify(_requestData);
      useEffect(function () {
        if (requestDataIsFunction && _requestData == null) return;
        request(_requestData);
      }, [hash]);
    }

    return {
      data: data,
      loading: loading,
      error: error,
      trigger: function trigger(callback) {
        var requestDataIsFunction = typeof requestData === 'function';

        var _requestData = requestDataIsFunction ? requestData() : requestData;

        if (requestDataIsFunction && _requestData == null) return;
        request(_requestData, callback);
      },
      refresh: function refresh(callback) {
        var requestDataIsFunction = typeof requestData === 'function';

        var _requestData = requestDataIsFunction ? requestData() : requestData;

        if (requestDataIsFunction && _requestData == null) return;
        request(_requestData, callback, true);
      }
    };
  };

  return useApi;
}

exports.FileData = FileData;
exports.createApiHook = createApiHook;
exports.parseRequestData = parseRequestData;
exports.prepare = prepare;
