import React from 'react'

import Board from './Board.jsx'

import '../styles/Observer.css'

class Observer extends React.Component {
  static wsParseRegex = /^(?<command>.+?)(?::(?<data>.+?))?(?:\/(?<extra>.+))?$/
  static dimensionX = 7
  static dimensionY = 6

  board = []
  initBoard = []
  moves = []
  queuedMove = null

  state = {
    waiting: true,
    player: null,
    turn: 0,
    winner: null,
    replaying: false,
    replayIndex: 0
  }

  constructor (props) {
    super(props)

    if (this.props.socket) {
      this.socket = this.props.socket

      const board = []
      for (let c = 0; c < Observer.dimensionX; ++c) board.push(new Array(Observer.dimensionY).fill(0))

      this.board = board
      this.initBoard = this.board.map((c) => c.map((r) => r)) // Clone Board
    }

    this.joinGame = this.joinGame.bind(this)
    this.setWinner = this.setWinner.bind(this)
    this.prepareReplay = this.prepareReplay.bind(this)
    this.advanceReplay = this.advanceReplay.bind(this)
    this.rewindReplay = this.rewindReplay.bind(this)
  }

  componentDidMount () {
    if (this.socket) {
      this.setState({
        player: 1,
        turn: 1
      })

      this.registerPlayerListeners()
    } else {
      this.socket = new WebSocket(`ws://${this.props.server}/observe/${this.props.game}`)

      this.registerObserverListeners()
    }
  }

  componentWillUnmount () {
    this.socket.close()
  }

  render () {
    return (
      <div className='panel'>
        <div className='controls'>
          {this.state.waiting && this.state.player !== 1
            ? (
              <button className='join' onClick={this.joinGame}>Join Game</button>
              )
            : null}
          {this.state.replaying
            ? (
              <>
                <div>
                  <button className='move prev' onClick={this.rewindReplay}>&#8617;</button>
                  <button className='move next' onClick={this.advanceReplay}>&#8618;</button>
                </div>

                <span className='currentmove'>Move: {this.state.replayIndex} / {this.moves.length}</span>
              </>
              )
            : null}
        </div>

        <div className='viewport'>
          <span className='turntag' player={this.state.waiting ? 0 : this.state.turn}>
            {this.state.waiting ? 'Waiting for game to start...' : `Player ${this.state.turn}'s turn`}
          </span>

          <Board data={this.board}/>

          {this.state.replaying || this.state.winner === null
            ? null
            : (
              <div className='overlay'>
                <span className='winner' player={this.state.winner}>{this.state.winner ? `Player ${this.state.winner} wins!` : 'Draw!'}</span>

                <button className='replay' onClick={this.prepareReplay}>Replay Game</button>
              </div>
              )}
        </div>

        <span className='id'>{this.props.game}</span>
      </div>
    )
  }

  joinGame () {
    this.socket.close()
    this.socket = new WebSocket(`ws://${this.props.server}/join/${this.props.game}`)
    this.registerPlayerListeners()

    const board = document.getElementsByClassName('board')[0]
    board.classList.add('playable')
    board.setAttribute('player', 2)

    const columns = board.getElementsByClassName('column')
    for (let c = 0; c < columns.length; ++c) columns[c].addEventListener('click', this.play.bind(this, c))

    this.setState({
      player: 2
    })
  }

  setWinner (winner) {
    const board = document.getElementsByClassName('board')[0]
    board.classList.remove('playable')

    this.setState({
      winner
    })
  }

  play (col) {
    this.socket.send('PLAY:' + col)

    this.queuedMove = col
  }

  prepareReplay () {
    const board = document.getElementsByClassName('board')[0]
    board.classList.remove('playable')

    this.board = this.initBoard

    const moves = this.board.reduce((a, c) => a + c.reduce((a, r) => r ? a + 1 : a, 0), 0)

    this.setState({
      turn: moves % 2 + 1,
      replaying: true
    })
  }

  advanceReplay () {
    if (this.state.replayIndex <= this.moves.length) {
      const move = this.moves[this.state.replayIndex]

      this.board[move.col][move.row] = move.player

      this.setState({
        turn: this.state.turn % 2 + 1,
        replayIndex: this.state.replayIndex + 1
      })
    }
  }

  rewindReplay () {
    if (this.state.replayIndex) {
      const move = this.moves[this.state.replayIndex - 1]

      this.board[move.col][move.row] = 0

      this.setState({
        turn: this.state.turn % 2 + 1,
        replayIndex: this.state.replayIndex - 1
      })
    }
  }

  registerObserverListeners () {
    this.socket.addEventListener('message', (e) => {
      const match = Observer.wsParseRegex.exec(e.data)

      switch (match.groups.command) {
        case 'BOARD': {
          const board = JSON.parse(match.groups.data)

          const moves = board.reduce((a, c) => a + c.reduce((a, r) => r ? a + 1 : a, 0), 0)

          this.board = board.map((c) => {
            while (c.length < Observer.dimensionY) c.push(0)

            return c
          })
          this.initBoard = this.board.map((c) => c.map((r) => r)) // Clone Board

          this.setState({
            turn: moves % 2 + 1
          })

          break
        }
        case 'GAMESTART':
          this.setState({
            waiting: false
          })

          break
        case 'MOVE': {
          const row = this.board[match.groups.extra].findIndex((p) => !p)

          this.board[match.groups.extra][row] = match.groups.data

          this.setState({
            turn: match.groups.data % 2 + 1
          })

          this.moves.push({
            col: match.groups.extra,
            row,
            player: match.groups.data
          })

          break
        }
        case 'WIN':
          this.setWinner(match.groups.data)

          break
        case 'DRAW':
          this.setWinner(0)

          break
        case 'TERMINATED':
          this.setWinner(0)

          break
        default: break
      }
    })
  }

  registerPlayerListeners () {
    this.socket.addEventListener('message', (e) => {
      const match = Observer.wsParseRegex.exec(e.data)

      switch (match.groups.command) {
        case 'GAMESTART': {
          const board = document.getElementsByClassName('board')[0]
          board.classList.add('playable')
          board.setAttribute('player', this.state.player)

          const columns = board.getElementsByClassName('column')
          for (let c = 0; c < columns.length; ++c) columns[c].addEventListener('click', this.play.bind(this, c))

          this.setState({
            waiting: false
          })

          break
        }
        case 'OPPONENT': {
          const row = this.board[match.groups.data].findIndex((p) => !p)

          this.board[match.groups.data][row] = this.state.player % 2 + 1

          this.setState({
            turn: this.state.player
          })

          this.moves.push({
            col: match.groups.data,
            row,
            player: this.state.player % 2 + 1
          })

          break
        }
        case 'ACK': { // Successful Move
          if (this.queuedMove !== null) {
            const row = this.board[this.queuedMove].findIndex((p) => !p)
            this.board[this.queuedMove][row] = this.state.player

            this.moves.push({
              col: this.queuedMove,
              row,
              player: this.state.player
            })

            this.setState({
              turn: this.state.player % 2 + 1
            })
          }

          break
        }
        case 'WIN':
          this.setWinner(this.state.player)

          break
        case 'LOSS':
          this.setWinner(this.state.player % 2 + 1)

          break
        case 'DRAW':
          this.setWinner(0)

          break
        case 'TERMINATED':
          this.setWinner(0)

          break
        default: break
      }
    })
  }
}

export default Observer
