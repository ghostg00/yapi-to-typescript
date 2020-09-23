#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
var tslib_1 = require("tslib");
var TSNode = tslib_1.__importStar(require("ts-node"));
var consola_1 = tslib_1.__importDefault(require("consola"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var ora_1 = tslib_1.__importDefault(require("ora"));
var path_1 = tslib_1.__importDefault(require("path"));
var prompts_1 = tslib_1.__importDefault(require("prompts"));
var vtils_1 = require("vtils");
var Generator_1 = require("./Generator");
TSNode.register({
    // 不加载本地的 tsconfig.json
    skipProject: true,
    // 仅转译，不做类型检查
    transpileOnly: true,
    // 自定义编译选项
    compilerOptions: {
        strict: false,
        target: 'es2017',
        module: 'commonjs',
        moduleResolution: 'node',
        declaration: false,
        removeComments: false,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        importHelpers: false,
        // 转换 js，支持在 ytt.config.js 里使用最新语法
        allowJs: true,
        lib: ['es2017'],
    },
});
function run(
/* istanbul ignore next */
cwd) {
    if (cwd === void 0) { cwd = process.cwd(); }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var configTSFile, configJSFile, configTSFileExist, configJSFileExist, _a, configFileExist, configFile, cmd, answers_1, answers, config, generator, spinner, output, err_1;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    configTSFile = path_1.default.join(cwd, 'ytt.config.ts');
                    configJSFile = path_1.default.join(cwd, 'ytt.config.js');
                    return [4 /*yield*/, fs_extra_1.default.pathExists(configTSFile)];
                case 1:
                    configTSFileExist = _b.sent();
                    _a = !configTSFileExist;
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, fs_extra_1.default.pathExists(configJSFile)];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3:
                    configJSFileExist = _a;
                    configFileExist = configTSFileExist || configJSFileExist;
                    configFile = configTSFileExist ? configTSFile : configJSFile;
                    cmd = process.argv[2];
                    if (!(cmd === 'help')) return [3 /*break*/, 4];
                    console.log("\n" + vtils_1.dedent(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["\n        # \u7528\u6CD5\n          \u521D\u59CB\u5316\u914D\u7F6E\u6587\u4EF6: ytt init\n          \u751F\u6210\u4EE3\u7801: ytt\n          \u67E5\u770B\u5E2E\u52A9: ytt help\n\n        # GitHub\n          https://github.com/fjc0k/yapi-to-typescript\n      "], ["\n        # \u7528\u6CD5\n          \u521D\u59CB\u5316\u914D\u7F6E\u6587\u4EF6: ytt init\n          \u751F\u6210\u4EE3\u7801: ytt\n          \u67E5\u770B\u5E2E\u52A9: ytt help\n\n        # GitHub\n          https://github.com/fjc0k/yapi-to-typescript\n      "]))) + "\n");
                    return [3 /*break*/, 14];
                case 4:
                    if (!(cmd === 'init')) return [3 /*break*/, 9];
                    if (!configFileExist) return [3 /*break*/, 6];
                    consola_1.default.info("\u68C0\u6D4B\u5230\u914D\u7F6E\u6587\u4EF6: " + configFile);
                    return [4 /*yield*/, prompts_1.default({
                            message: '是否覆盖已有配置文件?',
                            name: 'override',
                            type: 'confirm',
                        })];
                case 5:
                    answers_1 = _b.sent();
                    if (!answers_1.override)
                        return [2 /*return*/];
                    _b.label = 6;
                case 6: return [4 /*yield*/, prompts_1.default({
                        message: '选择配置文件类型?',
                        name: 'configFileType',
                        type: 'select',
                        choices: [
                            { title: 'TypeScript(ytt.config.ts)', value: 'ts' },
                            { title: 'JavaScript(ytt.config.js)', value: 'js' },
                        ],
                    })];
                case 7:
                    answers = _b.sent();
                    return [4 /*yield*/, fs_extra_1.default.outputFile(answers.configFileType === 'js' ? configJSFile : configTSFile, vtils_1.dedent(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["\n        import { defineConfig } from 'yapi-to-typescript'\n\n        export default defineConfig([\n          {\n            serverUrl: 'http://foo.bar',\n            typesOnly: false,\n            target: '", "',\n            reactHooks: {\n              enabled: false,\n            },\n            prodEnvName: 'production',\n            outputFilePath: 'src/api/index.", "',\n            requestFunctionFilePath: 'src/api/request.", "',\n            dataKey: 'data',\n            projects: [\n              {\n                token: 'hello',\n                categories: [\n                  {\n                    id: 0,\n                    getRequestFunctionName(interfaceInfo, changeCase) {\n                      return changeCase.camelCase(\n                        interfaceInfo.parsedPath.name,\n                      )\n                    },\n                  },\n                ],\n              },\n            ],\n          },\n        ])\n      "], ["\n        import { defineConfig } from 'yapi-to-typescript'\n\n        export default defineConfig([\n          {\n            serverUrl: 'http://foo.bar',\n            typesOnly: false,\n            target: '",
                            "',\n            reactHooks: {\n              enabled: false,\n            },\n            prodEnvName: 'production',\n            outputFilePath: 'src/api/index.", "',\n            requestFunctionFilePath: 'src/api/request.",
                            "',\n            dataKey: 'data',\n            projects: [\n              {\n                token: 'hello',\n                categories: [\n                  {\n                    id: 0,\n                    getRequestFunctionName(interfaceInfo, changeCase) {\n                      return changeCase.camelCase(\n                        interfaceInfo.parsedPath.name,\n                      )\n                    },\n                  },\n                ],\n              },\n            ],\n          },\n        ])\n      "])), (answers.configFileType === 'js'
                            ? 'javascript'
                            : 'typescript'), answers.configFileType, answers.configFileType))];
                case 8:
                    _b.sent();
                    consola_1.default.success('写入配置文件完毕');
                    return [3 /*break*/, 14];
                case 9:
                    if (!configFileExist) {
                        return [2 /*return*/, consola_1.default.error("\u627E\u4E0D\u5230\u914D\u7F6E\u6587\u4EF6: " + configTSFile + " \u6216 " + configJSFile)];
                    }
                    consola_1.default.success("\u627E\u5230\u914D\u7F6E\u6587\u4EF6: " + configFile);
                    _b.label = 10;
                case 10:
                    _b.trys.push([10, 13, , 14]);
                    config = require(configFile).default;
                    generator = new Generator_1.Generator(config, { cwd: cwd });
                    spinner = ora_1.default('正在获取数据并生成代码...').start();
                    return [4 /*yield*/, generator.generate()];
                case 11:
                    output = _b.sent();
                    spinner.stop();
                    consola_1.default.success('获取数据并生成代码完毕');
                    return [4 /*yield*/, generator.write(output)];
                case 12:
                    _b.sent();
                    consola_1.default.success('写入文件完毕');
                    return [3 /*break*/, 14];
                case 13:
                    err_1 = _b.sent();
                    /* istanbul ignore next */
                    return [2 /*return*/, consola_1.default.error(err_1)];
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
/* istanbul ignore next */
if (require.main === module) {
    run();
}
var templateObject_1, templateObject_2;
