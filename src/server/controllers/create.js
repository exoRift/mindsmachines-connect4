module.exports = {
  method: 'ws',
  route: '/create',
  action: function (ws, req, res) {
    console.log('Creating game for', req.connection.remoteAddress)

    const game = req.manager.createGame()

    ws.send(`ID:${game.id}`)

    req.handleGame(ws, req, game, 1)
  }
}
