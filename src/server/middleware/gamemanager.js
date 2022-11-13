const EventEmitter = require('events')

class Game extends EventEmitter {
  static dimensionX = 7
  static dimensionY = 6
  static combo = 4

  players = 1
  lastPlayed = 2

  constructor () {
    super()

    this.id = String(Date.now())

    this.board = []
    for (let x = 0; x < Game.dimensionX; ++x) this.board.push([])
  }

  async dropPiece (player, col) {
    if (player < 1 || player > 2) throw Error('invalid player')

    if (player === this.lastPlayed) throw Error('not player turn')

    if (col in this.board) {
      if (this.board[col].length >= Game.dimensionY) throw Error('column full')

      this.board[col].push(player)
      this.lastPlayed = player

      this.emit('move', player, col)

      this.assessWinner(player, col)
    } else throw Error('invalid column')
  }

  assessWinner (player, lastMove) {
    const row = this.board[lastMove].length - 1

    const won = (
      (this.countChain(player, lastMove, row, -1, 0) + this.countChain(player, lastMove + 1, row, 1, 0)) >= Game.combo - 1 || // Vertical
      (this.countChain(player, lastMove, row, 0, -1) + this.countChain(player, lastMove, row + 1, 0, 1)) >= Game.combo - 1 || // Horizontal
      (this.countChain(player, lastMove, row, -1, -1) + this.countChain(player, lastMove + 1, row + 1, 1, 1)) >= Game.combo - 1 || // Positive slope diagonal
      (this.countChain(player, lastMove + 1, row, 1, -1) + this.countChain(player, lastMove, row + 1, -1, 1)) >= Game.combo - 1 // Negative slope diagonal
    )

    if (won) this.emit('win', player)
  }

  countChain (player, col, row, colIncrement, rowIncrement) {
    let count = 0

    for (let c = col; c && c < this.board.length; c += colIncrement) {
      for (let r = row; r < this.board[c].length; r += rowIncrement) {
        if (this.board[c][r] !== player) return count
        else ++count

        if (!rowIncrement) break
      }

      if (!colIncrement) break
    }

    return count
  }
}

class Manager {
  games = new Map()

  createGame () {
    const game = new Game()

    this.games.set(game.id, game)

    return game
  }

  getGame (id) {
    return this.games.get(id)
  }

  destroyGame (id) {
    this.games.delete(id)
  }
}

const manager = new Manager()

function handleGame (ws, req, game, player) {
  ws.on('message', req.formatWSMsg(({ command, data }) => {
    if (command.toLowerCase() === 'play') {
      const position = parseInt(data)
      if (isNaN(position)) ws.send('ERROR:Invalid position')

      game.dropPiece(player, position)
        .then(() => {
          console.table({
            game: game.id,
            player,
            position
          })

          ws.send('ACK')
        })
        .catch((err) => ws.send(`ERROR:${err.message}`))
    }
  }))

  game.on('move', (mover, col) => {
    if (mover !== player) ws.send(`OPPONENT:${col}`)
  })

  game.on('win', (winner) => {
    ws.send(winner === player ? 'WIN' : 'LOSS')

    ws.close()

    req.manager.destroyGame(game.id)
  })
}

module.exports = function (req, res, next) {
  req.manager = manager
  req.handleGame = handleGame

  next()
}
