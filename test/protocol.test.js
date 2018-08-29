const assert = require('assert')
const validator = require('validator')

const protocol = require('../protocol')

describe('protocol', () => {

  describe('test fetchFieldType', () => {
    it('should return filed type', () => {
      assert(protocol.fetchFieldType(123) === 'Number')
      assert(protocol.fetchFieldType([]) === 'Array')
      assert(protocol.fetchFieldType(true) === 'Boolean')
      assert(protocol.fetchFieldType({}) === 'Object')
      assert(protocol.fetchFieldType(JSON) === 'JSON')
      assert(protocol.fetchFieldType('123') === 'String')
      assert(protocol.fetchFieldType(new Date()) === 'Date')
    })
  })

  describe('test parseUrl', () => {
    it('should return /123', () => {
      assert(protocol.parseUrl('/:id', { id: 123}) === '/123')
      assert(protocol.parseUrl('/:id', { id: '123'}) === '/123')
    })
  })

  describe('test accept', () => {
    const rule = {
      'GET /:id': [
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

    it('should error for accept', () => {
      try {
        const params = protocol.accept({
          org: 'RHs'
        }, rule[`GET /:id`])
      } catch (err) {
        assert(err.message === `传入字段: org 其类型为: String ，字段描述:参数只能为枚举值：["RH"]`)
      }
    })

    it('market should be Boolean type', () => {
      try {
        const params = protocol.accept({
          org: 'RH', market: ''
        }, rule[`GET /:id`])
      } catch (err) {
        assert(err.message === `传入字段: market 类型应为: Boolean ，字段描述:接口参数market`)
      }
    })

    it('freq should be Number type', () => {
      try {
        const params = protocol.accept({
          org: 'RH', market: true, freq: '123'
        }, rule[`GET /:id`])
      } catch (err) {
        assert(err.message === `传入字段: freq 类型应为: Number ，字段描述:接口参数freq`)
      }
    })

    it('rule should be Object type', () => {
      try {
        const params = protocol.accept({
          org: 'RH', market: true, freq: 123, rule: ''
        }, rule[`GET /:id`])
      } catch (err) {
        assert(err.message === `传入字段: rule 类型应为: Object ，字段描述:接口参数rule`)
      }
    })

    it('validDate should be Date type', () => {
      try {
        const params = protocol.accept({
          org: 'RH', market: true, freq: 123, rule: {}, validDate: 'new Date()' 
        }, rule[`GET /:id`])
      } catch (err) {
        assert(err.message === `传入字段: validDate 类型应为: Date ，字段描述:接口参数validDate`)
      }
    })

    it('validDate should be Date type', () => {
      try {
        const params = protocol.accept({
          org: 'RH', market: true, freq: 123, rule: {}, validDate: new Date(), nickName: ''
        }, rule[`GET /:id`])

        assert('nickname' in params)
      } catch (err) {
        console.log(err)
      }
    })

  })

})