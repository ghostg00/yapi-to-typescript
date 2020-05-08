import fs from 'fs-extra'
import path from 'path'
import tempy from 'tempy'
import {forOwn, OneOrMore} from 'vtils'
import {Generator} from '../src/Generator'

afterEach(() => {
  require('request-promise-native').resetExportCount()
})

const generatorFactory = (id: OneOrMore<0 | 82 | 87 | 151 | -82 | -87 | -151>, typesOnly: boolean, enableReactHooks: boolean = false) => {
  const apiDir = tempy.directory()
  return new Generator({
    serverUrl: 'http://foo.bar',
    typesOnly: typesOnly,
    prodEnvName: 'production',
    outputFilePath: path.join(apiDir, 'index.ts'),
    requestFunctionFilePath: path.join(apiDir, 'request.ts'),
    reactHooks: {
      enabled: enableReactHooks,
    },
    projects: [
      {
        token: 'hello',
        categories: [
          {
            id: id,
            preproccessInterface(ii) {
              ii.path += '_test'
              return ii
            },
            getRequestFunctionName(ii, cc) {
              return cc.camelCase(ii.parsedPath.name)
            },
            getRequestDataTypeName(ii, cc) {
              return `${cc.pascalCase(ii.parsedPath.name)}Request`
            },
            getResponseDataTypeName(ii, cc) {
              return `${cc.pascalCase(ii.parsedPath.name)}Response`
            },
          },
        ],
      },
    ],
  })
}

describe('Generator', () => {
  test('正确生成代码并写入文件 - 单分类', async () => {
    const generator = generatorFactory(82, false)
    const output = await generator.generate()
    forOwn(output, ({content}) => {
      expect(content).toMatchSnapshot('输出内容')
    })

    await generator.write(output)
    forOwn(output, ({requestFunctionFilePath}, outputFilePath) => {
      expect(fs.readFileSync(outputFilePath).toString()).toMatchSnapshot('接口文件')
      expect(fs.readFileSync(requestFunctionFilePath).toString()).toMatchSnapshot('请求文件')
    })
  })

  test('正确生成代码并写入文件 - 多分类', async () => {
    const generator = generatorFactory([82, 87], false)
    const output = await generator.generate()
    forOwn(output, ({content}) => {
      expect(content).toMatchSnapshot('输出内容')
    })

    await generator.write(output)
    forOwn(output, ({requestFunctionFilePath}, outputFilePath) => {
      expect(fs.readFileSync(outputFilePath).toString()).toMatchSnapshot('接口文件')
      expect(fs.readFileSync(requestFunctionFilePath).toString()).toMatchSnapshot('请求文件')
    })
  })

  test('正确生成代码并写入文件 - 全部分类', async () => {
    const generator = generatorFactory(0, false)
    const output = await generator.generate()
    forOwn(output, ({content}) => {
      expect(content).toMatchSnapshot('输出内容')
    })

    await generator.write(output)
    forOwn(output, ({requestFunctionFilePath}, outputFilePath) => {
      expect(fs.readFileSync(outputFilePath).toString()).toMatchSnapshot('接口文件')
      expect(fs.readFileSync(requestFunctionFilePath).toString()).toMatchSnapshot('请求文件')
    })
  })

  test('正确生成代码并写入文件 - 排除分类', async () => {
    const generator = generatorFactory([0, -82], false)
    const output = await generator.generate()
    forOwn(output, ({content}) => {
      expect(content).toMatchSnapshot('输出内容')
    })

    await generator.write(output)
    forOwn(output, ({requestFunctionFilePath}, outputFilePath) => {
      expect(fs.readFileSync(outputFilePath).toString()).toMatchSnapshot('接口文件')
      expect(fs.readFileSync(requestFunctionFilePath).toString()).toMatchSnapshot('请求文件')
    })
  })

  test('只生成类型代码并写入文件', async () => {
    const generator = generatorFactory(82, true)
    const output = await generator.generate()
    forOwn(output, ({content}) => {
      expect(content).toMatchSnapshot('输出内容')
    })

    await generator.write(output)
    forOwn(output, ({requestFunctionFilePath}, outputFilePath) => {
      expect(fs.readFileSync(outputFilePath).toString()).toMatchSnapshot('接口文件')
      expect(fs.existsSync(requestFunctionFilePath)).toBe(false)
    })
  })

  test('生成 React Hooks 代码', async () => {
    const generator = generatorFactory(82, false, true)
    const output = await generator.generate()
    forOwn(output, ({content}) => {
      expect(content).toMatchSnapshot('输出内容')
    })

    await generator.write(output)
    forOwn(output, ({requestFunctionFilePath, requestHookMakerFilePath}, outputFilePath) => {
      expect(fs.readFileSync(outputFilePath).toString()).toMatchSnapshot('接口文件')
      expect(fs.readFileSync(requestFunctionFilePath).toString()).toMatchSnapshot('请求文件')
      expect(fs.readFileSync(requestHookMakerFilePath).toString()).toMatchSnapshot('Hook 生成文件')
    })
  })

  test('同一个项目导出接口列表 API 应只请求一次', async () => {
    const generator = generatorFactory(0, false)
    await generator.generate()
    expect(require('request-promise-native').getExportCount()).toEqual(1)
  })
})
