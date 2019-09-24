"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createApiHook({ useState, useEffect, requestFunction, autoTrigger }) {
    const useApi = function (requestData) {
        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(!!autoTrigger);
        const [error, setError] = useState(null);
        const request = (requestData, callback, noChangeLoading) => {
            if (!noChangeLoading) {
                setLoading(true);
            }
            (requestData == null ? requestFunction() : requestFunction(requestData))
                .then(data => {
                if (error != null) {
                    setError(null);
                }
                setData(data);
                if (typeof callback === 'function') {
                    callback();
                }
            }, error => setError(error))
                .then(() => {
                if (!noChangeLoading) {
                    setLoading(false);
                }
            });
        };
        if (autoTrigger) {
            const requestDataIsFunction = typeof requestData === 'function';
            const _requestData = requestDataIsFunction
                ? requestData()
                : requestData;
            const hash = JSON.stringify(_requestData);
            useEffect(() => {
                if (requestDataIsFunction && _requestData == null)
                    return;
                request(_requestData);
            }, [hash]);
        }
        return {
            data: data,
            loading: loading,
            error: error,
            trigger: callback => {
                const requestDataIsFunction = typeof requestData === 'function';
                const _requestData = requestDataIsFunction
                    ? requestData()
                    : requestData;
                if (requestDataIsFunction && _requestData == null)
                    return;
                request(_requestData, callback);
            },
            refresh: callback => {
                const requestDataIsFunction = typeof requestData === 'function';
                const _requestData = requestDataIsFunction
                    ? requestData()
                    : requestData;
                if (requestDataIsFunction && _requestData == null)
                    return;
                request(_requestData, callback, true);
            },
        };
    };
    return useApi;
}
exports.createApiHook = createApiHook;
