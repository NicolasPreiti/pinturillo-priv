import {io, Socket} from "socket.io-client"
import { IChatMessage, IChatMessages } from "../components/chat-box/chat-box.interfaces"
import { ICanvasInfo, ICoords, IMousePosition } from "../interfaces/draw.interface"

const serverUrl = "http://localhost:3000"
let socket: Socket

export const initSocket = (roomName: string, url = serverUrl, ): Socket => {
  socket = io(url, {
    query: {
      roomName
    }
  })
  return socket
}

export const emitMousePos = (data: IMousePosition): void => {
  socket.emit("mousePos", data)
}

export const onMousePos = (cb: (cursorPos: ICoords, emit: boolean, color: string) => void): void => {
  socket.on("mousePos", (data: IMousePosition) => {
    cb(data.coords, false, data.color)
  })
}

export const emitCleanPoints = () => {
  socket.emit("cleanPoints")
}

export const onCleanPoints = (canvasInfo: ICanvasInfo) => {
  socket.on("cleanPoints", () => {
    canvasInfo.points = []
  })
}

export const emitCleanCanvas = () => {
  socket.emit("cleanCanvas")
}

export const onCleanCanvas = (context: CanvasRenderingContext2D | null, canvasInfo: ICanvasInfo) => {
  socket.on("cleanCanvas", () => { 
    if (!context) return
    context.clearRect(0, 0, canvasInfo.width, canvasInfo.height)
  })
}

export const emitChatMessage = (chatMessage: IChatMessage) => {
  socket.emit("chatMessage", chatMessage)
}

export const onChatMessage = (cb: (chatMessage: IChatMessage) => void) => {
  socket.on("chatMessage", (chatMessage: IChatMessage) => {
    cb(chatMessage)
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