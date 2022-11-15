module.exports = {
  method: 'ws',
  route: '/join/:id',
  action: function (ws, req, res) {
    const game = req.manager.getGame(req.params.id)

    if (game) {
      if (game.players >= 2) {
        ws.send('ERROR:game full')

        ws.close()
      } else {
        console.log(req.connection.remoteAddress, 'joining game', game.id)

        ++game.players
        ws.send('ACK')
        game.emit('start')

        req.handleGame(ws, req, game, 2)
      }
    } else {
      ws.send('ERROR:game not found')

      ws.close()
    }
  }
}
