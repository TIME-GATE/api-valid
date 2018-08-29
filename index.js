const protocol = require('./protocol')

module.exports.accept = (params, accepts) => {
  return protocol.accept(params, accepts)
}

module.exports.entity = (data, entitys) => {
  return protocol.entity(data, entitys)
}

module.exports.parseUrl = (params, path) => {
  return protocol.parseUrl(params, path)
}