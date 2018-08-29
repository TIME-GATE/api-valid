const {
  accept,
  entity
} = require('../protocol')

module.exports = async function (template, curReq) {  
  const notValidate = accept(allParams, template[curReq])
  return next()
}