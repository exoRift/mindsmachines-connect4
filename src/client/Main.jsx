import React from 'react'

import Observer from './modules/Observer.jsx'

import './styles/Main.css'

class Main extends React.Component {
  static refreshRate = 1000

  state = {
    server: null,
    currentGame: null,
    games: [],
    inputs: {
      server: ''
    },
    inputLocked: false
  }

  constructor (props) {
    super(props)

    this.testServer = this.testServer.bind(this)
  }

  componentWillUnmount () {
    clearInterval(this.refreshInterval)
  }

  render () {
    return (
      <div className={`page${this.state.server ? ' active' : ''}`}>
        <div className='header'>
          <h1>
            <span>Connect</span>
            &nbsp;
            <span>Four</span>
          </h1>
          <h2>Minds and Machines</h2>
        </div>

        {this.state.server
          ? this.state.currentGame
            ? (
              <>
                <button className='return' onClick={this.setGame.bind(this, null)}>Return to game selection</button>

                <Observer server={this.state.server} game={this.state.currentGame}/>
              </>
              )
            : (
              <div className='games'>
                {this.state.games.length
                  ? this.state.games.map((g, i) => (
                    <div className='gamecard' key={i} onClick={this.setGame.bind(this, g)}>
                      <span>{g}</span>
                    </div>
                  ))
                  : <span>No games found!</span>}
              </div>
              )
          : (
            <form className='connection' onSubmit={this.testServer}>
              <input
                className='server'
                placeholder='Enter server address...'
                value={this.state.inputs.server}
                onChange={this.setInput('server')}
                disabled={this.state.inputLocked}
              />

              <button className='connect' disabled={this.state.inputLocked}>Connect!</button>
            </form>
            )}
      </div>
    )
  }

  setInput (field) {
    return (e) => {
      this.setState({
        inputs: {
          ...this.state.inputs,
          [field]: e.target.value
        }
      })
    }
  }

  testServer (e) {
    e?.preventDefault?.()

    this.setState({
      inputLocked: true
    })

    return fetch('http://' + this.state.inputs.server, {
      method: 'GET'
    })
      .then((res) => {
        if (!res.ok) throw Error()
        else return res.text()
      })
      .then((msg) => {
        if (msg === 'connect4') {
          this.setState({
            server: this.state.inputs.server
          })

          this.refreshGames(this.state.inputs.server)
          this.refreshInterval = setInterval(() => this.refreshGames(this.state.inputs.server), Main.refreshRate)
        } else throw Error()
      })
      .catch(() => alert('Could not connect to server!'))
      .finally(() => this.setState({ inputLocked: false }))
  }

  refreshGames (server) {
    return fetch(`http://${server}/list`, {
      method: 'GET'
    })
      .then((res) => {
        if (!res.ok) throw Error()
        else return res.json()
      })
      .then((games) => {
        this.setState({
          games
        })
      })
      .catch(() => alert('Could not get active games!'))
  }

  setGame (game) {
    this.setState({
      currentGame: game
    })

    if (game) clearInterval(this.refreshInterval)
    else this.testServer()
  }
}

export default Main
