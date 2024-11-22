const https = require('https')
const fs = require('fs')
const path = require('path')
const os = require('os')
const express = require('express')
const ws = require('express-ws')
const cors = require('cors')

const PORT = process.argv[3] || process.argv[2] || 5000

const app = express()

const {
  formatws,
  sendtype,
  gamemanager
} = require('./middleware/')
const controllers = require('./controllers/')

ws(app)
app
  .use(cors())
  .use(formatws)
  .use(sendtype)
  .use(gamemanager)

// Routes
for (const controller of controllers) {
  app[controller.method](controller.route, controller.action)
}
app.all('/', (req, res) => res.send(200, 'connect4'))

const ssl = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
}
const server = https.createServer(ssl, app)

server.listen(PORT, () => {
  const {
    port
  } = server.address()

  const interfaces = Object.values(os.networkInterfaces()).flat()

  console.info('Server online listening at https://%s:%s', interfaces.find((i) => !i.internal && i.family === 'IPv4').address, port)
})
