import { Server } from 'socket.io'
import express from 'express'
import { Server as HttpServer } from 'http'
import cors from 'cors'

const PORT = 3000
const app = express()
const server = new HttpServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

app.use(cors())

io.on('connection', async (socket) => {
  const user = socket.id
  console.log(user)

  socket.on('mousePos', (data) => {
    socket.broadcast.emit('mousePos', data)
  })

  socket.on('cleanPoints', () => {
    socket.broadcast.emit('cleanPoints')
  })

  socket.on('cleanCanvas', () => {
    socket.broadcast.emit('cleanCanvas')
  })
})

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`)
})
