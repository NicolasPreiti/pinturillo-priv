import {io, Socket} from "socket.io-client"

const serverUrl = "http://localhost:3000"
let socket: Socket

const initSocket = (url = serverUrl): Socket => {
  socket = io(url)
  return socket
}

const emitMousePos = (socket: Socket, data: any): void => {
  socket.emit("mousePos", data)
}

const onMousePos = (socket: Socket, cb: (data: any, emit: boolean) => void): void => {
  socket.on("mousePos", (data: any) => {
    cb(data, false)
  })
}

const emitCleanPoints = (socket: Socket) => {
  socket.emit("cleanPoints")
}

const onCleanPoints = (points: any[]) => {
  socket.on("cleanPoints", () => {
    points = []
  })
}

const emitCleanCanvas = (socket: Socket) => {
  socket.emit("cleanCanvas")
}

const onCleanCanvas = (context: CanvasRenderingContext2D | null, {width, height}: {width: number, height: number}) => {
  socket.on("cleanCanvas", () => { 
    if (!context) return
    context.clearRect(0, 0, width, height)
  })
}

export const ioService = {
  initSocket,
  emitMousePos,
  onMousePos,
  emitCleanPoints,
  onCleanPoints,
  emitCleanCanvas,
  onCleanCanvas,
}