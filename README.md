## Installation

API参数验证, 验证接口收到的数据是否合法

`npm install api-valid --save`

## Tests

`npm run test`

## Examples 1 :

```js
const validator = require('validator')

const {
  accept,
  parseUrl
} = require('api-valid')


const template = {

  'GET /user/name': [
    { 
      accept: 'org', required: true, type: 'String', desc: '参数只能为枚举值：["RH"]', 
      fn: (str) => { return validator.isIn(str, ['RH']) } 
    },
    { accept: 'market', required: true, type: 'Boolean', desc: '接口参数market' },
    { accept: 'freq', required: true, type: 'Number', desc: '接口参数freq' },
    { accept: 'rule', required: true, type: 'Object', desc: '接口参数rule' },
    { accept: 'validDate', required: true, type: 'Date', desc: '接口参数validDate' },
    { accept: 'nickName', required: false, type: 'String', as: 'nickname', desc: '接口参数nickName' },
  ]

}

try {
  const params = accept({
    org: 'RH',
    market: true,
    freq: 12.11,
    rule: { name: '' },
    validDate: new Date()
  }, template['GET /user/name'])
  console.log('############ PARAMS IS OK ############\n', params)
} catch (error) {
  console.log('############ PARAMS NOT VALID ############\n', error)
}
```

* 情景一、参数校验完全合法:

```js
{
  org: 'RH',
  market: true,
  freq: 12.11,
  rule: { name: '' },
  validDate: new Date()
}
```

```
############ PARAMS IS OK ############
 { org: 'RH',
  market: true,
  freq: 12.11,
  rule: { name: '' },
  validDate: 2018-08-29T04:15:44.890Z }
```


* 情景二、参数类型不合法:

```js
{
  org: 'RH',
  market: 111,
  freq: 12.11,
  rule: { name: '' },
  validDate: new Date()
}
```

```
{ message: '传入字段: market 类型应为: Boolean ，字段描述:' }
```

* 情景三、参数是必传项:

```js
{
  market: 111,
  freq: 12.11,
  rule: { name: '' },
  validDate: new Date()
}
```

```
{ message: '未传入字段: org 其类型为: String，字段描述:接口参数org' }
```

* 情景四、参数不符合特定的规则:

```js
{
  org: 'NO',
  market: 111,
  freq: 12.11,
  rule: { name: '' },
  validDate: new Date()
}
```

```
{ message: '传入字段: org 其类型为: String ，字段描述:参数只能为枚举值：["RH"]' }
```

* 情景五、给参数变化别名:

```js
{
  org: 'NO',
  market: 111,
  freq: 12.11,
  rule: { name: '' },
  validDate: new Date(),
  nickName: 'zhang'
}
```

```
############ PARAMS IS OK ############
 { org: 'RH',
  market: true,
  freq: 12.11,
  rule: { name: '' },
  validDate: 2018-08-29T04:27:58.405Z,
  nickname: 'zhang' }
```


## Examples 2 :

* 引入到sails中




```js
const ApiValid = require('api-valid')
const validator = require('validator')

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

  middleware: {

  /***************************************************************************
  *                                                                          *
  * The order in which middleware should be run for HTTP request. (the Sails *
  * router is invoked by the "router" middleware below.)                     *
  *                                                                          *
  ***************************************************************************/

    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'bodyParser',
      'ApiValidator',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ],

  /****************************************************************************
  *                                                                           *
  * Example custom middleware; logs each request to the console.              *
  *                                                                           *
  ****************************************************************************/

    ApiValidator: async function(req, res, next) {
      const rule = {
        'GET /v1/:id/name': [
          { 
            accept: 'org', required: true, type: 'String', desc: '参数只能为枚举值：["RH"]', 
            fn: (str) => { return validator.isIn(str, ['RH']) } 
          },
          { accept: 'market', required: true, type: 'Boolean', desc: '接口参数market' },
          { accept: 'freq', required: true, type: 'Number', desc: '接口参数freq' },
          { accept: 'rule', required: true, type: 'Object', desc: '接口参数rule' },
          { accept: 'validDate', required: true, type: 'Date', desc: '接口参数validDate' },
          { accept: 'nickName', required: false, type: 'String', as: 'nickname', desc: '接口参数nickName' },
        ]
      }

      const allRoutes = Object.keys(sails.config.routes)
      const params = Object.assign({}, req.query, req.body)
      let currPath = null

      for(let item of allRoutes) {
        if(item === `${req.method} ${req.path}`) {
          currPath = `${req.method} ${req.path}`
          break
        }

        try {
          tempPath = ApiValid.parseUrl(item, params)
        } catch (err) {
          console.log(`allRoutes.forEach ${item}`, err)
        }

        if(tempPath === `${req.method} ${req.path}`) {
          currPath = `${item}`
          break
        }

      }

      if(currPath) {
        try {
          req.acceptParams = ApiValid.accept(params, rule[currPath])
        } catch(err) {
          return res.send({
            code: -1,
            message: err.message || '参数错误',
            data: {}
          })
        }
      }

      return next()
    },

  },

};
```


* 请求
```bash
curl -X GET \
  'http://127.0.0.1/v1/123/name?id=123&org=RH'
```

* 打印:

```
{
  "code": -1,
  "message": "未传入字段: market 其类型为: Boolean，字段描述:接口参数market",
  "data": {}
}
```


## Contributors

 - qian.zhang

## MIT Licenced

