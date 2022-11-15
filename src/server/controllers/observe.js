module.exports = {
  method: 'ws',
  route: '/observe',
  action: function (ws, req, res) {
    const game = req.manager.getGame(req.params.id)

    if (game) {
      console.log(req.connection.remoteAddress, 'observing game', game.id)

      ws.send(`BOARD:${JSON.stringify(game.board)}`)

      game.on('move', (player, col) => {
        ws.send(`MOVE:${player}/${col}`)
      })

      game.on('win', (player) => {
        ws.send(`WIN:${player}`)

        ws.close()
      })

      game.on('draw', (winner) => {
        ws.send('DRAW')

        ws.close()

        req.manager.destroyGame(game.id)
      })
    } else {
      ws.send('ERROR:game not found')

      ws.close()
    }
  }
}
