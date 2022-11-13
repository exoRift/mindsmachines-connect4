const {
  toObject
} = require('mass-require')

module.exports = toObject(__dirname, {
  exclude: /^index\.js$/
})
