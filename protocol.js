/** 可靠性验证: 输入/输出
 * 
 * accept: 统一格式化并校验入口参数
 * 
 *  =>@{accept}: 接受字段
 *  =>@{as}: 字段别名
 *  =>@{required}: false: 非必须 true: 必须
 *  =>@{type}: 字段类型 枚举: Number String Array Object Date Null
 *  =>@{desc}: 字段描述
 *  =>@{fn}: 函数判断
 * 
 * Entity: 格式化输出
 *  => 同accept
 */

const validator = require('validator')
const pathToRegExp = require('path-to-regexp') 

class Protocol {

  accept(params, accepts) {
    const acceptParams = {}

    for (const item of accepts) {

      if (item.required && !Reflect.has(params, item.accept)) {
        throw { message: `未传入字段: ${item.accept} 其类型为: ${item.type}，字段描述:${item.desc}` }
      }

      if (!item.required && !Reflect.has(params, item.accept)) {
        continue
      }

      if (item.fn && !item.fn(params[item.accept])) {
        throw { message: `传入字段: ${item.accept} 其类型为: ${item.type} ，字段描述:${item.desc}` }
      }

      if(item.type !== this.fetchFieldType(params[item.accept])) {
        throw { message: `传入字段: ${item.accept} 类型应为: ${item.type} ，字段描述:${item.desc}` }      
      }

      try {
        switch (item.type) {
          case 'Number':
            acceptParams[item.as ? item.as : item.accept] = params[item.accept]
            break
          case 'String':
            acceptParams[item.as ? item.as : item.accept] = params[item.accept]
            break
          case 'Boolean':
            acceptParams[item.as ? item.as : item.accept] = Boolean(+params[item.accept] || item.accept === 'true')
            break
          case 'Date':
            acceptParams[item.as ? item.as : item.accept] = new Date(params[item.accept].toISOString())
            break
          case 'Object':
            acceptParams[item.as ? item.as : item.accept] = params[item.accept]
            break
          case 'Array':
            acceptParams[item.as ? item.as : item.accept] = params[item.accept]
            break
          default:
            throw {
              message: "不在指定类型范围内的参数错误"
            }
        }
      } catch (err) {
        console.log(`################### API PARAMS ERROR: ###################\n`, err)
        throw {
          message: `NEED: ${JSON.stringify(item)} BUT GIVEN: ${params[item.accept]}`,
        }
      }
    }

    return acceptParams
  }

  entity(data, choosedApi, entitys) {
    accepts[choosedApi].forEach((item) => {})
    return data
  }

  fetchFieldType(obj) {
    const t = Object.prototype.toString.call(obj)
    const f = t.substring(8, t.length - 1)

    return f.substring(0, 1).toUpperCase() + f.substring(1)
  }

  parseUrl(path, params) {
    const args = params;
    const url = path.replace('\(\.\*\)', '');
    const toPath = pathToRegExp.compile(url);
  
    if (typeof params != 'object') {
      args = Array.prototype.slice.call(arguments);
    }
  
    if (args instanceof Array) {
      const tokens = pathToRegExp.parse(url);
      const replace = {};
      
      for (let len = tokens.length, i=0, j=0; i<len; i++) {
        if (tokens[i].name) replace[tokens[i].name] = args[j++];
      }

      return toPath(replace);
    }

    return toPath(params);
  }

}

module.exports = new Protocol()