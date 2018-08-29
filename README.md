## Installation

API参数验证, 验证接口收到的数据是否合法

`npm install api-valid --save`

## Tests

`npm test`

## Examples :

```js
const validator = require('validator')

const {
  accept,
  parseUrl
} = require('./index')


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

## Contributors

 - qian.zhang

## MIT Licenced

