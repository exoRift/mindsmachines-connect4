module.exports = {
  method: 'get',
  route: '/list',
  action: function (req, res) {
    res.send(200, Array.from(req.manager.games.keys()))
  }
}
