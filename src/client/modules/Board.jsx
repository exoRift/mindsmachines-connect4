import React from 'react'

import '../styles/Board.css'

class Board extends React.Component {
  render () {
    return (
      <div className='board'>
        {this.props.data.map((c, i) => (
          <div className='column' key={i}>
            {c.map((r, j) => (
              <div className='row' key={j}>
                {r
                  ? (
                    <div className='piece' player={r}/>
                    )
                  : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }
}

export default Board
