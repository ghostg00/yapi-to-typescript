import { Config, Interface, InterfaceList, SyntheticalConfig } from './types';
interface OutputFileList {
    [outputFilePath: string]: {
        syntheticalConfig: SyntheticalConfig;
        content: string[];
        requestFilePath: string;
    };
}
export declare class Generator {
    private options;
    /** 配置 */
    private config;
    /** { 项目标识: 分类列表 } */
    private projectIdToCategoryList;
    constructor(config: Config, options?: {
        cwd: string;
    });
    generate(): Promise<OutputFileList>;
    write(outputFileList: OutputFileList): Promise<void[]>;
    /** 生成请求数据类型 */
    static generateRequestDataType({ interfaceInfo, typeName }: {
        interfaceInfo: Interface;
        typeName: string;
    }): Promise<string>;
    /** 生成响应数据类型 */
    static generateResponseDataType({ interfaceInfo, typeName, dataKey }: {
        interfaceInfo: Interface;
        typeName: string;
        dataKey?: string;
    }): Promise<string>;
    static fetchApi<T = any>(url: string, query: Record<string, any>): Promise<T>;
    /** 获取分类的接口列表 */
    fetchInterfaceList({ serverUrl, token, id }: SyntheticalConfig): Promise<InterfaceList>;
    /** 获取项目信息 */
    static fetchProjectInfo(syntheticalConfig: SyntheticalConfig): Promise<{
        cats: {
            _id: number;
            name: string;
            desc: string;
        }[];
        getMockUrl: () => string;
        getDevUrl: (devEnvName: string) => string;
        getProdUrl: (prodEnvName: string) => string;
        _id: number;
        name: string;
        basepath: string;
        env: {
            name: string;
            domain: string;
        }[];
    }>;
    /** 生成接口代码 */
    static generateInterfaceCode(syntheticalConfig: SyntheticalConfig, interfaceInfo: Interface, categoryUID: string): Promise<string>;
}
export {};
