const parseRegex = /^(?<command>.+?)(?::(?<data>.+?))?(?:\/(?<extra>.+))?$/

module.exports = function (req, res, next) {
  req.formatWSMsg = function (cb) {
    return (msg) => {
      const data = parseRegex.exec(msg)

      cb(data.groups)
    }
  }

  next()
}
