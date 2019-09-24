#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const TSNode = tslib_1.__importStar(require("ts-node"));
const consola_1 = tslib_1.__importDefault(require("consola"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const ora_1 = tslib_1.__importDefault(require("ora"));
const path_1 = tslib_1.__importDefault(require("path"));
const prompts_1 = tslib_1.__importDefault(require("prompts"));
const vtils_1 = require("vtils");
const Generator_1 = require("./Generator");
TSNode.register({
    transpileOnly: true,
    compilerOptions: {
        module: 'commonjs',
    },
});
async function run(cwd = process.cwd()) {
    const pkg = require('../package.json');
    const configFile = path_1.default.join(cwd, 'ytt.config.ts');
    const cmd = process.argv[2];
    if (cmd === 'version') {
        /* istanbul ignore next */
        console.log(`${pkg.name} v${pkg.version}`);
    }
    else if (cmd === 'help') {
        /* istanbul ignore next */
        console.log(`\n${vtils_1.dedent `
      # 用法
        初始化配置文件: ytt init
        生成代码: ytt
        查看版本: ytt version
        查看帮助: ytt help

      # GitHub
        https://github.com/fjc0k/yapi-to-typescript
    `}\n`);
    }
    else if (cmd === 'init') {
        if (await fs_extra_1.default.pathExists(configFile)) {
            consola_1.default.info(`检测到配置文件: ${configFile}`);
            const answers = await prompts_1.default({
                type: 'confirm',
                name: 'override',
                message: '是否覆盖已有配置文件?',
            });
            if (!answers.override)
                return;
        }
        await fs_extra_1.default.outputFile(configFile, vtils_1.dedent `
      import { Config } from 'yapi-to-typescript'

      const config: Config = [
        {
          serverUrl: 'http://foo.bar',
          typesOnly: false,
          reactHooks: {
            enable: false,
          },
          prodEnvName: 'production',
          outputFilePath: 'src/api/index.ts',
          requestFunctionFilePath: 'src/api/request.ts',
          dataKey: 'data',
          projects: [
            {
              token: 'hello',
              categories: [
                {
                  id: 50,
                  getRequestFunctionName(interfaceInfo, changeCase) {
                    return changeCase.camelCase(
                      interfaceInfo.parsedPath.name,
                    )
                  },
                },
              ],
            },
          ],
        },
      ]

      export default config
    `);
        consola_1.default.success('写入配置文件完毕');
    }
    else {
        if (!await fs_extra_1.default.pathExists(configFile)) {
            return consola_1.default.error(`找不到配置文件: ${configFile}`);
        }
        consola_1.default.success(`找到配置文件: ${configFile}`);
        try {
            const config = require(configFile).default;
            const generator = new Generator_1.Generator(config, { cwd });
            const spinner = ora_1.default('正在获取数据并生成代码...').start();
            const output = await generator.generate();
            spinner.stop();
            consola_1.default.success('获取数据并生成代码完毕');
            await generator.write(output);
            consola_1.default.success('写入文件完毕');
        }
        catch (err) {
            /* istanbul ignore next */
            return consola_1.default.error(err);
        }
    }
}
exports.run = run;
/* istanbul ignore next */
if (require.main === module) {
    run();
}
