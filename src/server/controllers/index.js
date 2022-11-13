const {
  toArray
} = require('mass-require')

module.exports = toArray(__dirname, {
  exclude: /^index\.js$/
})
