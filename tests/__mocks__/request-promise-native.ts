const mockData: Record<string, any> = {
  '/api/plugin/export': [
    {
      index: 0,
      name: 'test',
      desc: null,
      add_time: 1568765163,
      up_time: 1568765163,
      list: [
        {
          query_path: {
            path: '/deleteMethod',
            params: [],
          },
          edit_uid: 0,
          status: 'undone',
          type: 'static',
          req_body_is_json_schema: true,
          res_body_is_json_schema: true,
          api_opened: false,
          index: 0,
          tag: [],
          _id: 433,
          method: 'DELETE',
          catid: 82,
          title: 'DELETE 方法',
          path: '/deleteMethod',
          project_id: 27,
          req_params: [],
          res_body_type: 'json',
          req_query: [],
          req_headers: [
            {
              required: '1',
              _id: '5cbdd2e993bc6574a2de33e5',
              name: 'Content-Type',
              value: 'application/json',
            },
          ],
          req_body_form: [],
          markdown: '',
          desc: '',
          res_body: '{"type":"object","title":"empty object","properties":{}}',
          req_body_type: 'json',
          req_body_other: '{"type":"object","title":"empty object","properties":{"id":{"type":"string","description":"ID"}},"required":["id"]}',
          uid: 11,
          add_time: 1568765163,
          up_time: 1568765163,
          __v: 0,
        },
        {
          query_path: {
            path: '/getMethod',
            params: [],
          },
          edit_uid: 0,
          status: 'undone',
          type: 'static',
          req_body_is_json_schema: true,
          res_body_is_json_schema: true,
          api_opened: false,
          index: 0,
          tag: [],
          _id: 434,
          method: 'GET',
          catid: 82,
          title: 'GET 方法',
          path: '/getMethod',
          project_id: 27,
          res_body_type: 'json',
          req_body_form: [],
          req_params: [],
          req_headers: [],
          req_query: [
            {
              required: '1',
              _id: '5cbdd1c293bc6574a2de33db',
              name: 'x',
              example: '100',
              desc: 'X 值',
            },
            {
              required: '0',
              _id: '5cbdd1c293bc6574a2de33da',
              name: 'y',
              example: '2',
              desc: 'Y 值',
            },
          ],
          markdown: '',
          desc: '',
          res_body: '{"type":"object","title":"empty object","properties":{"result":{"type":"number","description":"结果"}},"required":["result"]}',
          uid: 11,
          add_time: 1568765164,
          up_time: 1568765164,
          __v: 0,
        },
        {
          query_path: {
            path: '/json5Response',
            params: [],
          },
          edit_uid: 0,
          status: 'undone',
          type: 'static',
          req_body_is_json_schema: false,
          res_body_is_json_schema: false,
          api_opened: false,
          index: 0,
          tag: [],
          _id: 435,
          method: 'GET',
          catid: 82,
          title: 'JSON5 响应',
          path: '/json5Response',
          project_id: 27,
          req_params: [],
          res_body_type: 'json',
          req_query: [],
          req_headers: [],
          req_body_form: [],
          markdown: '',
          desc: '',
          res_body: '{\n    /** 注释 */\n    "id": 1,\n    "age": "@float",\n    "name": "@name"\n}',
          uid: 11,
          add_time: 1568765164,
          up_time: 1568765164,
          __v: 0,
        },
        {
          query_path: {
            path: '/json5Request',
            params: [],
          },
          edit_uid: 0,
          status: 'undone',
          type: 'static',
          req_body_is_json_schema: false,
          res_body_is_json_schema: false,
          api_opened: false,
          index: 0,
          tag: [],
          _id: 436,
          method: 'POST',
          catid: 82,
          title: 'JSON5 请求',
          path: '/json5Request',
          project_id: 27,
          req_params: [],
          res_body_type: 'json',
          req_query: [],
          req_headers: [
            {
              required: '1',
              _id: '5cbdd32f93bc6574a2de33e6',
              name: 'Content-Type',
              value: 'application/json',
            },
          ],
          req_body_form: [],
          req_body_other: '{\n   "id": 1,\n   "name": "方剑成",\n   "likes": [\n      "photo",\n      2\n   ]\n}',
          markdown: '',
          desc: '',
          res_body: '',
          req_body_type: 'json',
          uid: 11,
          add_time: 1568765164,
          up_time: 1568765164,
          __v: 0,
        },
        {
          query_path: {
            path: '/postMethod',
            params: [],
          },
          edit_uid: 0,
          status: 'undone',
          type: 'static',
          req_body_is_json_schema: true,
          res_body_is_json_schema: true,
          api_opened: false,
          index: 0,
          tag: [],
          _id: 437,
          method: 'POST',
          catid: 82,
          title: 'POST 方法',
          path: '/postMethod',
          project_id: 27,
          res_body_type: 'json',
          req_body_form: [],
          req_params: [],
          req_headers: [
            {
              required: '1',
              _id: '5cbdd24b93bc6574a2de33dd',
              name: 'Content-Type',
              value: 'application/json',
            },
          ],
          req_query: [],
          req_body_other: '{"type":"object","title":"empty object","properties":{"page":{"type":"number","description":"页码"},"limit":{"type":"number","description":"每页数量"},"keyword":{"type":"string","description":"关键词"}},"required":["page","limit"]}',
          markdown: '**备注。。。**\n\n`额鹅鹅鹅`',
          desc: '<p><strong>备注。。。</strong></p>\n<p><code data-backticks="1">额鹅鹅鹅</code></p>\n',
          res_body: '{"type":"object","title":"empty object","properties":{"list":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string","description":"姓名"}},"required":["name"]},"description":"列表"}},"required":["list"]}',
          req_body_type: 'json',
          uid: 11,
          add_time: 1568765164,
          up_time: 1568765164,
          __v: 0,
        },
        {
          query_path: {
            path: '/putMethod',
            params: [],
          },
          edit_uid: 0,
          status: 'undone',
          type: 'static',
          req_body_is_json_schema: true,
          res_body_is_json_schema: true,
          api_opened: false,
          index: 0,
          tag: [],
          _id: 438,
          method: 'PUT',
          catid: 82,
          title: 'PUT 方法',
          path: '/putMethod',
          project_id: 27,
          req_params: [],
          res_body_type: 'json',
          req_query: [
            {
              required: '1',
              _id: '5cbdd2b793bc6574a2de33e2',
              name: 'id',
              desc: '',
            },
            {
              required: '0',
              _id: '5cbdd2b793bc6574a2de33e1',
              name: 'namre',
              example: '',
              desc: '',
            },
          ],
          req_headers: [
            {
              required: '1',
              _id: '5cbdd2b793bc6574a2de33e3',
              name: 'Content-Type',
              value: 'application/x-www-form-urlencoded',
            },
          ],
          req_body_form: [
            {
              required: '1',
              _id: '5cbdd2b793bc6574a2de33e4',
              name: 'x',
              type: 'text',
              example: '9',
              desc: 'X 值',
            },
          ],
          markdown: '',
          desc: '',
          res_body: '{"type":"object","title":"empty object","properties":{"err":{"type":"number","description":"错误"},"msg":{"type":"string","description":"错误详情"},"data":{"type":"object","properties":{},"description":"数据"}},"required":["err","msg"]}',
          req_body_type: 'form',
          uid: 11,
          add_time: 1568765164,
          up_time: 1568765164,
          __v: 0,
        },
        {
          query_path: {
            path: '/dataKeyExample',
            params: [],
          },
          edit_uid: 0,
          status: 'undone',
          type: 'static',
          req_body_is_json_schema: true,
          res_body_is_json_schema: true,
          api_opened: false,
          index: 0,
          tag: [],
          _id: 439,
          method: 'PUT',
          catid: 82,
          title: 'dataKey 例子',
          path: '/dataKeyExample',
          project_id: 27,
          req_params: [],
          res_body_type: 'json',
          req_query: [
            {
              required: '1',
              _id: '5cbdd3e093bc6574a2de33ec',
              name: 'id',
              desc: '',
            },
            {
              required: '0',
              _id: '5cbdd3e093bc6574a2de33eb',
              name: 'namre',
              example: '',
              desc: '',
            },
          ],
          req_headers: [
            {
              required: '1',
              _id: '5cbdd3e093bc6574a2de33ed',
              name: 'Content-Type',
              value: 'application/x-www-form-urlencoded',
            },
          ],
          req_body_form: [
            {
              required: '1',
              _id: '5cbdd3e093bc6574a2de33ee',
              name: 'x',
              type: 'text',
              example: '9',
              desc: 'X 值',
            },
          ],
          markdown: '',
          desc: '',
          res_body: '{"type":"object","title":"empty object","properties":{"err":{"type":"number","description":"错误"},"msg":{"type":"string","description":"错误详情"},"data":{"type":"object","properties":{"success":{"type":"boolean","description":"成功啦"}},"description":"数据","required":["success"]}},"required":["err","msg"]}',
          req_body_type: 'form',
          uid: 11,
          add_time: 1568765165,
          up_time: 1568765165,
          __v: 0,
        },
        {
          query_path: {
            path: '/upload',
            params: [],
          },
          edit_uid: 0,
          status: 'undone',
          type: 'static',
          req_body_is_json_schema: true,
          res_body_is_json_schema: true,
          api_opened: false,
          index: 0,
          tag: [],
          _id: 887,
          method: 'POST',
          catid: 82,
          title: '文件',
          path: '/upload',
          project_id: 27,
          req_params: [],
          res_body_type: 'json',
          uid: 11,
          add_time: 1582161232,
          up_time: 1582161261,
          req_query: [],
          req_headers: [
            {
              required: '1',
              _id: '5e4ddd6d857008453968175a',
              name: 'Content-Type',
              value: 'multipart/form-data',
            },
          ],
          req_body_form: [
            {
              required: '1',
              _id: '5e4ddd6d8570083c9568175c',
              name: 'file',
              type: 'file',
              desc: '文件',
            },
            {
              required: '1',
              _id: '5e4ddd6d8570081bfd68175b',
              name: 'name',
              type: 'text',
              example: '',
              desc: '名称',
            },
          ],
          __v: 0,
          desc: '',
          markdown: '',
          req_body_type: 'form',
          res_body: '{"type":"object","title":"empty object","properties":{}}',
        },
        {
          query_path: {
            path: '/noResponseData',
            params: [],
          },
          edit_uid: 0,
          status: 'undone',
          type: 'static',
          req_body_is_json_schema: false,
          res_body_is_json_schema: false,
          api_opened: false,
          index: 0,
          tag: [],
          _id: 440,
          method: 'GET',
          catid: 82,
          title: '没返回数据',
          path: '/noResponseData',
          project_id: 27,
          req_params: [],
          res_body_type: 'json',
          req_query: [],
          req_headers: [],
          req_body_form: [],
          uid: 11,
          add_time: 1568765165,
          up_time: 1568765165,
          __v: 0,
        },
        {
          query_path: {
            path: '/emptyResponse',
            params: [],
          },
          edit_uid: 0,
          status: 'undone',
          type: 'static',
          req_body_is_json_schema: false,
          res_body_is_json_schema: true,
          api_opened: false,
          index: 0,
          tag: [],
          _id: 441,
          method: 'POST',
          catid: 82,
          title: '空返回数据',
          path: '/emptyResponse',
          project_id: 27,
          req_params: [],
          res_body_type: 'json',
          req_query: [],
          req_headers: [
            {
              required: '1',
              _id: '5cbdd0f793bc6574a2de33d9',
              name: 'Content-Type',
              value: 'application/x-www-form-urlencoded',
            },
          ],
          req_body_form: [],
          markdown: '',
          desc: '',
          res_body: '{"type":"object","title":"empty object","properties":{}}',
          req_body_type: 'form',
          uid: 11,
          add_time: 1568765165,
          up_time: 1568765165,
          __v: 0,
        },
        {
          query_path: {
            path: '/path/:id/hello/:name/:pass/{avatar}/:test',
            params: [],
          },
          edit_uid: 0,
          status: 'undone',
          type: 'var',
          req_body_is_json_schema: false,
          res_body_is_json_schema: false,
          api_opened: false,
          index: 0,
          tag: [],
          _id: 442,
          method: 'POST',
          catid: 82,
          title: '路径参数',
          path: '/path/:id/hello/:name/:pass/{avatar}/:test',
          project_id: 27,
          req_params: [
            {
              _id: '5d80d7103667dc0844b411d7',
              name: 'id',
              example: 'ID',
              desc: '23',
            },
            {
              _id: '5d80d7103667dc0844b411d6',
              name: 'name',
              desc: '',
            },
            {
              _id: '5d80d7103667dc0844b411d5',
              name: 'pass',
              desc: '',
            },
            {
              _id: '5d80d7103667dc0844b411d4',
              name: 'test',
              desc: '',
            },
            {
              _id: '5d80d7103667dc0844b411d3',
              name: 'avatar',
              desc: '',
            },
          ],
          res_body_type: 'json',
          req_query: [],
          req_headers: [
            {
              required: '1',
              _id: '5d80d7103667dc0844b411d8',
              name: 'Content-Type',
              value: 'application/x-www-form-urlencoded',
            },
          ],
          req_body_form: [],
          markdown: '',
          desc: '',
          res_body: '',
          req_body_type: 'form',
          uid: 11,
          add_time: 1568765165,
          up_time: 1568765165,
          __v: 0,
        },
        {
          query_path: {
            path: '/test/{id}/:hihihi',
            params: [],
          },
          edit_uid: 0,
          status: 'undone',
          type: 'var',
          req_body_is_json_schema: true,
          res_body_is_json_schema: false,
          api_opened: false,
          index: 0,
          tag: [],
          _id: 443,
          method: 'POST',
          catid: 82,
          title: '路径参数+对象',
          path: '/test/{id}/:hihihi',
          project_id: 27,
          req_params: [
            {
              _id: '5d80e91e3667dc0844b411df',
              name: 'hihihi',
              example: 'demo',
              desc: '嗨咯',
            },
            {
              _id: '5d80e91e3667dc0844b411de',
              name: 'id',
              example: '110',
              desc: 'ID',
            },
          ],
          res_body_type: 'json',
          req_query: [],
          req_headers: [
            {
              required: '1',
              _id: '5d80e91e3667dc0844b411e0',
              name: 'Content-Type',
              value: 'application/json',
            },
          ],
          req_body_form: [],
          req_body_other: '{"type":"object","title":"empty object","properties":{"K1":{"type":"string","description":"键1"},"K2":{"type":"number","description":"键2"}},"required":["K1"]}',
          markdown: '',
          desc: '',
          res_body: '',
          req_body_type: 'json',
          uid: 11,
          add_time: 1568765165,
          up_time: 1568765165,
          __v: 0,
        },
        {
          query_path: {
            path: '/rawResponse',
            params: [],
          },
          edit_uid: 0,
          status: 'undone',
          type: 'static',
          req_body_is_json_schema: false,
          res_body_is_json_schema: false,
          api_opened: false,
          index: 0,
          tag: [],
          _id: 444,
          method: 'GET',
          catid: 82,
          title: '返回 raw',
          path: '/rawResponse',
          project_id: 27,
          req_params: [],
          res_body_type: 'raw',
          req_query: [],
          req_headers: [],
          req_body_form: [],
          markdown: '',
          desc: '',
          res_body: '',
          uid: 11,
          add_time: 1568765166,
          up_time: 1568765166,
          __v: 0,
        },
      ],
    },
    {
      index: 0,
      name: 'test2',
      desc: null,
      add_time: 1568765163,
      up_time: 1568765163,
      list: [
        {
          query_path: {
            path: '/get2',
            params: [],
          },
          edit_uid: 0,
          status: 'done',
          type: 'static',
          req_body_is_json_schema: true,
          res_body_is_json_schema: true,
          api_opened: false,
          index: 0,
          tag: [
            '2期',
            '梦想城',
          ],
          _id: 445,
          method: 'GET',
          catid: 87,
          title: 'hello',
          path: '/get2',
          project_id: 27,
          req_params: [],
          res_body_type: 'json',
          req_query: [],
          req_headers: [],
          req_body_form: [],
          markdown: '',
          desc: '',
          res_body: '{"type":"object","title":"empty object","properties":{"msg":{"type":"string"}},"required":["msg"]}',
          uid: 11,
          add_time: 1568765166,
          up_time: 1575945946,
          __v: 0,
        },
      ],
    },
    {
      index: 0,
      name: 'issues',
      desc: null,
      add_time: 1575453704,
      up_time: 1575453704,
      list: [
        {
          query_path: {
            path: '/issue-17/picture_3d_detail',
            params: [],
          },
          edit_uid: 0,
          status: 'undone',
          type: 'static',
          req_body_is_json_schema: true,
          res_body_is_json_schema: true,
          api_opened: false,
          index: 0,
          tag: [],
          _id: 870,
          method: 'GET',
          catid: 151,
          title: '17: path 含有数字时，大小写出现错误',
          path: '/issue-17/picture_3d_detail',
          project_id: 27,
          req_params: [],
          res_body_type: 'json',
          uid: 11,
          add_time: 1575453762,
          up_time: 1575455147,
          req_query: [],
          req_headers: [],
          req_body_form: [],
          __v: 0,
          desc: '<p><a href="https://github.com/fjc0k/yapi-to-typescript/issues/17">https://github.com/fjc0k/yapi-to-typescript/issues/17</a></p>\n',
          markdown: '[https://github.com/fjc0k/yapi-to-typescript/issues/17](https://github.com/fjc0k/yapi-to-typescript/issues/17)',
          res_body: '{"type":"object","title":"empty object","properties":{}}',
        },
      ],
    },
  ],
  '/api/interface/getCatMenu': {
    errcode: 0,
    errmsg: '成功！',
    data: [
      {
        index: 0,
        _id: 77,
        name: '公共分类',
        project_id: 27,
        desc: '公共分类',
        uid: 11,
        add_time: 1568765151,
        up_time: 1568765151,
        __v: 0,
      },
      {
        index: 0,
        _id: 82,
        name: 'test',
        project_id: 27,
        desc: null,
        uid: 11,
        add_time: 1568765163,
        up_time: 1568765163,
        __v: 0,
      },
      {
        index: 0,
        _id: 87,
        name: 'test2',
        project_id: 27,
        desc: null,
        uid: 11,
        add_time: 1568765163,
        up_time: 1568765163,
        __v: 0,
      },
      {
        index: 0,
        _id: 151,
        name: 'issues',
        project_id: 27,
        desc: null,
        uid: 11,
        add_time: 1575453704,
        up_time: 1575453704,
        __v: 0,
      },
    ],
  },
  '/api/project/get': {
    errcode: 0,
    errmsg: '成功！',
    data: {
      switch_notice: true,
      is_mock_open: false,
      is_sync_open: false,
      strice: false,
      is_json5: false,
      _id: 32,
      name: 'test',
      basepath: '',
      project_type: 'private',
      uid: 11,
      group_id: 11,
      icon: 'code-o',
      color: 'yellow',
      add_time: 1554276482,
      up_time: 1555516501,
      env: [
        {
          header: [],
          global: [],
          _id: '5cb74c5593bc6574a2de33cc',
          name: 'production',
          domain: 'http://prod.com/',
        },
        {
          header: [],
          global: [],
          _id: '5ca460829301e2047a07b652',
          name: 'local',
          domain: 'http://127.0.0.1',
        },
      ],
      tag: [],
      desc: '44555666666',
      cat: [],
      role: 'admin',
    },
  },
}

const request = {
  get: (url: string) => {
    const path = Object.keys(mockData).find(path => url.endsWith(path))
    return path && mockData[path]
  },
}

module.exports = request
