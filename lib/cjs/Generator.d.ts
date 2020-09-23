/// <reference types="lodash" />
import { CategoryList, Config, Interface, InterfaceList, Project, SyntheticalConfig } from './types';
interface OutputFileList {
    [outputFilePath: string]: {
        syntheticalConfig: SyntheticalConfig;
        content: string[];
        requestFunctionFilePath: string;
        requestHookMakerFilePath: string;
    };
}
export declare class Generator {
    private options;
    /** 配置 */
    private config;
    constructor(config: Config, options?: {
        cwd: string;
    });
    generate(): Promise<OutputFileList>;
    write(outputFileList: OutputFileList): Promise<void[]>;
    tsc(file: string): Promise<unknown>;
    /** 生成请求数据类型 */
    generateRequestDataType({ interfaceInfo, typeName, }: {
        interfaceInfo: Interface;
        typeName: string;
    }): Promise<string>;
    /** 生成响应数据类型 */
    generateResponseDataType({ interfaceInfo, typeName, dataKey, }: {
        interfaceInfo: Interface;
        typeName: string;
        dataKey?: string;
    }): Promise<string>;
    fetchApi<T = any>(url: string, query: Record<string, any>): Promise<T>;
    fetchProject: (({ serverUrl, token }: SyntheticalConfig) => Promise<Project>) & import("lodash").MemoizedFunction;
    fetchExport: (({ serverUrl, token }: SyntheticalConfig) => Promise<import("./types").Category[]>) & import("lodash").MemoizedFunction;
    /** 获取分类的接口列表 */
    fetchInterfaceList({ serverUrl, token, id, }: SyntheticalConfig): Promise<InterfaceList>;
    /** 获取项目信息 */
    fetchProjectInfo(syntheticalConfig: SyntheticalConfig): Promise<{
        cats: CategoryList;
        getMockUrl: () => string;
        getDevUrl: (devEnvName: string) => string;
        getProdUrl: (prodEnvName: string) => string;
        _id: number;
        name: string;
        desc: string;
        basepath: string;
        tag: string[];
        env: {
            name: string;
            domain: string;
        }[];
    }>;
    /** 生成接口代码 */
    generateInterfaceCode(syntheticalConfig: SyntheticalConfig, interfaceInfo: Interface, categoryUID: string): Promise<string>;
}
export {};
