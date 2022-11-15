import React from 'react'

import Board from './modules/Board.jsx'

import './styles/Main.css'

class Main extends React.Component {
  static refreshRate = 5000

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
            ? null
            : (
              <div className='games'>
                {this.state.games.map((g, i) => (
                  <div className='gamecard' key={i} onClick={() => this.setState({ currentGame: g })}>
                    <span>{g}</span>
                  </div>
                ))}
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
    const server = 'http://' + this.state.inputs.server

    e.preventDefault()

    this.setState({
      inputLocked: true
    })

    return fetch(server, {
      method: 'GET'
    })
      .then((res) => {
        if (!res.ok) throw Error()
        else return res.text()
      })
      .then((msg) => {
        if (msg === 'connect4') {
          this.setState({
            server
          })

          this.refreshGames(server)
          this.refreshInterval = setInterval(() => this.refreshGames(server), Main.refreshRate)
        } else throw Error()
      })
      .catch(() => alert('Could not connect to server!'))
      .finally(() => this.setState({ inputLocked: false }))
  }

  refreshGames (server) {
    return fetch(server + '/list', {
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
}

export default Main
