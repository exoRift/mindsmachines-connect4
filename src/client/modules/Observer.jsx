import React from 'react'

import Board from './Board.jsx'

import '../styles/Observer.css'

class Observer extends React.Component {
  static wsParseRegex = /^(?<command>.+?)(?::(?<data>.+?))?(?:\/(?<extra>.+))?$/
  static dimensionY = 6

  state = {
    board: [],
    waiting: true,
    turn: 0,
    winner: null
  }

  componentDidMount () {
    this.socket = new WebSocket(`ws://${this.props.server}/observe/${this.props.game}`)

    this.socket.addEventListener('message', (e) => {
      const match = Observer.wsParseRegex.exec(e.data)

      switch (match.groups.command) {
        case 'BOARD': {
          const board = JSON.parse(match.groups.data)

          const moves = board.reduce((a, c) => a + c.reduce((a, r) => r ? a + 1 : a, 0), 0)

          this.setState({
            board: board.map((c) => {
              while (c.length < Observer.dimensionY) c.push(0)

              return c
            }),
            turn: moves % 2 + 1
          })

          break
        }
        case 'GAMESTART':
          this.setState({
            waiting: false
          })

          break
        case 'MOVE':
          // eslint-disable-next-line
          this.state.board[match.groups.extra][this.state.board[match.groups.extra].findIndex((p) => !p)] = match.groups.data

          this.setState({
            turn: match.groups.data % 2 + 1
          })

          break
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
        <div className='controls'>
        </div>

        <div className='viewport'>
          <span className='turntag' player={this.state.waiting ? 0 : this.state.turn}>
            {this.state.waiting ? 'Waiting for game to start...' : `Player ${this.state.turn}'s turn`}
          </span>

          <Board data={this.state.board}/>

          {this.state.winner === null
            ? null
            : (
              <div className='overlay'>
                <span className='winner' player={this.state.winner}>{this.state.winner ? `Player ${this.state.winner} wins!` : 'Draw!'}</span>
              </div>
              )}
        </div>
      </div>
    )
  }
}

export default Observer
