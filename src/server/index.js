const express = require('express')
const ws = require('express-ws')

const PORT = process.argv[2]

const app = express()

const {
  formatws,
  sendtype,
  gamemanager
} = require('./middleware/')
const controllers = require('./controllers/')

ws(app)
app
  .use(formatws)
  .use(sendtype)
  .use(gamemanager)

// Routes
for (const controller of controllers) {
  app[controller.method](controller.route, controller.action)
}
app.all('/', (req, res) => res.send(200))

const server = app.listen(PORT, () => {
  const {
    port
  } = server.address()

  console.info('Server online listening at https://localhost:%s', port)
})
