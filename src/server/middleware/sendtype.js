const send = require('@polka/send-type')

module.exports = function (req, res, next) {
  res.send = function (status, content) {
    send(this, status, content)
  }

  next()
}
