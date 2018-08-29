const validator = require('validator')

const {
  accept,
  entity,
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
    validDate: new Date(),
    nickName: 'zhang'
  }, template['GET /user/name'])
  console.log('############ PARAMS IS OK ############\n', params)
} catch (error) {
  console.log('############ PARAMS NOT VALID ############\n', error)
}


// const na = parseUrl('/ae/adf/:id', {id:1})

// console.log(na)

