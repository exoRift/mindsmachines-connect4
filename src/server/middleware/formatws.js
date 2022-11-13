const parseRegex = /^(?<command>.+):(?<data>.+)$/

module.exports = function (req, res, next) {
  req.formatWSMsg = function (cb) {
    return (msg) => {
      const data = parseRegex.exec(msg)

      cb(data.groups)
    }
  }

  next()
}
