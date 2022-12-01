module.exports = {
  method: 'ws',
  route: '/create',
  action: function (ws, req, res) {
    const game = req.manager.createGame()

    console.log(req.connection.remoteAddress, 'creating game', game.id)

    ws.send(`ID:${game.id}`)

    req.handleGame(ws, req, game, 1)
  }
}
