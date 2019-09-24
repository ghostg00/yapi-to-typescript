import { AsyncReturnType } from 'vtils';
import { useEffect, useState } from 'react';
declare type RequestFunction = (...args: any[]) => Promise<any>;
interface CreateApiHookPayload<T extends RequestFunction> {
    useState: typeof useState;
    useEffect: typeof useEffect;
    requestFunction: T;
    autoTrigger: boolean;
}
interface ApiHookResult<T extends RequestFunction> {
    /**
     * 接口返回数据。
     */
    data: AsyncReturnType<T>;
    /**
     * 是否正在请求数据。
     */
    loading: boolean;
    /**
     * 如果请求过程中发生错误，则将其赋给 error。
     */
    error: any;
    /**
     * 触发请求。
     *
     * @param callback 请求完成并设置 data、error 后的回调
     */
    trigger: (callback?: () => any) => void;
    /**
     * 刷新数据，同触发请求，但不会变更 loading 状态。
     *
     * @param callback 请求完成并设置 data、error 后的回调
     */
    refresh: (callback?: () => any) => void;
}
interface ApiHook<T extends RequestFunction> {
    (requestData: Parameters<T>[0] | (() => Parameters<T>[0] | null | undefined)): ApiHookResult<T>;
}
interface ApiHookOptional<T extends RequestFunction> {
    (requestData?: Parameters<T>[0] | (() => Parameters<T>[0] | null | undefined)): ApiHookResult<T>;
}
export declare function createApiHook<T extends RequestFunction, O extends boolean>({ useState, useEffect, requestFunction, autoTrigger }: CreateApiHookPayload<T>): O extends true ? ApiHookOptional<T> : ApiHook<T>;
export {};
