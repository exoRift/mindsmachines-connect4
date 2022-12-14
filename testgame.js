const WebSocket = require('ws')

const p1 = new WebSocket('ws://localhost:5000/create/')

if (process.argv[2] !== 'none') {
  p1.addEventListener('message', async (e) => {
    const [command, data] = e.data.split(':')

    if (command === 'ID') {
      await sleep(1500)
      const p2 = new WebSocket('ws://localhost:5000/join/' + data)

      await sleep(500)
      switch (process.argv[2]) {
        case '1':
          p1.send('play:0')
          await sleep(500)
          p2.send('play:1')
          await sleep(500)
          p1.send('play:1')
          await sleep(500)
          p2.send('play:2')
          await sleep(500)
          p1.send('play:2')
          await sleep(500)
          p2.send('play:3')
          await sleep(500)
          p1.send('play:3')
          await sleep(500)
          p2.send('play:0')
          await sleep(500)
          p1.send('play:2')
          await sleep(500)
          p2.send('play:5')
          await sleep(500)
          p1.send('play:4')
          await sleep(500)
          p2.send('play:1')
          await sleep(500)
          p1.send('play:1')

          break
        case '2':
          p1.send('play:0')
          await sleep(500)
          p2.send('play:1')
          await sleep(500)
          p1.send('play:1')
          await sleep(500)
          p2.send('play:2')
          await sleep(500)
          p1.send('play:2')
          await sleep(500)
          p2.send('play:3')
          await sleep(500)
          p1.send('play:3')
          await sleep(500)
          p2.send('play:0')
          await sleep(500)
          p1.send('play:2')
          await sleep(500)
          p2.send('play:5')
          await sleep(500)
          p1.send('play:0')
          await sleep(500)
          p2.send('play:4')

          break
        case 'draw':
          p1.send('play:0')
          await sleep(500)
          p2.send('play:1')
          await sleep(500)
          p1.send('play:0')
          await sleep(500)
          p2.send('play:1')
          await sleep(500)
          p1.send('play:0')
          await sleep(500)
          p2.send('play:1')
          await sleep(500)
          p1.send('play:2')
          await sleep(500)
          p2.send('play:3')
          await sleep(500)
          p1.send('play:2')
          await sleep(500)
          p2.send('play:3')
          await sleep(500)
          p1.send('play:2')
          await sleep(500)
          p2.send('play:3')
          await sleep(500)
          p1.send('play:4')
          await sleep(500)
          p2.send('play:5')
          await sleep(500)
          p1.send('play:4')
          await sleep(500)
          p2.send('play:5')
          await sleep(500)
          p1.send('play:4')
          await sleep(500)
          p2.send('play:5')
          await sleep(500)
          p1.send('play:6')
          await sleep(500)
          p2.send('play:0')
          await sleep(500)
          p1.send('play:6')
          await sleep(500)
          p2.send('play:0')
          await sleep(500)
          p1.send('play:6')
          await sleep(500)
          p2.send('play:0')
          await sleep(500)
          p1.send('play:1')
          await sleep(500)
          p2.send('play:2')
          await sleep(500)
          p1.send('play:1')
          await sleep(500)
          p2.send('play:2')
          await sleep(500)
          p1.send('play:1')
          await sleep(500)
          p2.send('play:2')
          await sleep(500)
          p1.send('play:3')
          await sleep(500)
          p2.send('play:4')
          await sleep(500)
          p1.send('play:3')
          await sleep(500)
          p2.send('play:4')
          await sleep(500)
          p1.send('play:3')
          await sleep(500)
          p2.send('play:4')
          await sleep(500)
          p1.send('play:5')
          await sleep(500)
          p2.send('play:6')
          await sleep(500)
          p1.send('play:5')
          await sleep(500)
          p2.send('play:6')
          await sleep(500)
          p1.send('play:5')
          await sleep(500)
          p2.send('play:6')

          break
        default:
          p1.close()

          break
      }
    }
  })
}

function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
