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

  state = {
    waiting: true,
    turn: 0,
    winner: null,
    replaying: false,
    replayIndex: 0
  }

  constructor (props) {
    super(props)

    this.prepareReplay = this.prepareReplay.bind(this)
    this.advanceReplay = this.advanceReplay.bind(this)
    this.rewindReplay = this.rewindReplay.bind(this)
  }

  componentDidMount () {
    this.socket = new WebSocket(`ws://${this.props.server}/observe/${this.props.game}`)

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
          this.setState({
            winner: match.groups.data
          })

          break
        case 'DRAW':
          this.setState({
            winner: 0
          })

          break

        default: break
      }
    })
  }

  componentWillUnmount () {
    this.socket.close()
  }

  render () {
    return (
      <div className='panel'>
        {this.state.replaying
          ? (
            <div className='controls'>
              <span className='currentmove'>Move: {this.state.replayIndex} / {this.moves.length}</span>

              <div>
                <button className='prev' onClick={this.rewindReplay}>&#8617;</button>
                <button className='next' onClick={this.advanceReplay}>&#8618;</button>
              </div>
            </div>
            )
          : null}

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
      </div>
    )
  }

  prepareReplay () {
    this.board = this.initBoard

    this.setState({
      replaying: true
    })
  }

  advanceReplay () {
    if (this.state.replayIndex <= this.moves.length) {
      const move = this.moves[this.state.replayIndex]

      this.board[move.col][move.row] = move.player

      this.setState({
        replayIndex: this.state.replayIndex + 1
      })
    }
  }

  rewindReplay () {
    if (this.state.replayIndex) {
      const move = this.moves[this.state.replayIndex - 1]

      this.board[move.col][move.row] = 0

      this.setState({
        replayIndex: this.state.replayIndex - 1
      })
    }
  }
}

export default Observer
