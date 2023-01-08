import React, { ReactElement, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { ioService } from "../../services/io.service";

export function Draw(): ReactElement {
  const { initSocket, emitMousePos, onMousePos, emitCleanPoints, onCleanPoints, emitCleanCanvas, onCleanCanvas } = ioService
  const canvas = useRef<HTMLCanvasElement>(null)
  let socket: Socket
  let context: CanvasRenderingContext2D | null
  let points: Array<{x: number, y: number}> = []
  let isDrawing = false
  const width = 800
  const height = 800

  useEffect(() => {
    socket = ioService.initSocket()
    onMousePos(socket, writePoints)
    socket.on("cleanPoints", () => {
      points = []
    })
    onCleanCanvas(context, {width, height})

    if (canvas.current !== null) {
      context = canvas.current.getContext("2d")
      canvas.current.width = width
      canvas.current.height = height
      
      if (context) {
        context.lineWidth = 3
        context.lineCap = "round"
        context.strokeStyle = "#000"
      }
    }
  }, [])


  const mouseMove = (evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return

    const { clientX, clientY } = evt
    write({
      x: clientX,
      y: clientY
    })
  }

  const write = (coord: {x: number, y: number}): void => {    
    if (canvas.current) {
      const rect = canvas.current.getBoundingClientRect()
      const cursorPos = {
        x: coord.x - rect?.left,
        y: coord.y - rect?.top
      }
      
      writePoints(cursorPos)
    }
  }

  const writePoints = (cursorPos: {x: number, y: number}, emit = true) => {
    points.push(cursorPos)
    if (points.length > 3) {
      const prev = points[points.length - 1]
      const current = points[points.length - 2]
      
      drawOnCanvas(prev, current)
    }
    if (emit) emitMousePos(socket, cursorPos)
  }

  const drawOnCanvas = (prev: {x: number, y: number}, current: {x: number, y: number}) => {
    if (context) {
      context.beginPath()
      context.moveTo(prev.x, prev.y)
      context.lineTo(current.x, current.y)
      context.stroke()
    }
  }

  const startDrawing = () => {
    isDrawing = true
  }

  const stopDrawing = () => {
    isDrawing = false
    points = []
    emitCleanPoints(socket)
  }

  const cleanCanvas = () => {
    if (!context) return
    points = []
    context.clearRect(0, 0, width, height)
    emitCleanCanvas(socket)
  }

  return(
    <>
      <canvas 
      ref={canvas}
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      // onMouseLeave={stopDrawing}
      onMouseMove={mouseMove}
      width={500}
      height={500}
      style={{border: "1px solid red"}}></canvas>
      <div>
        <button onClick={cleanCanvas}>limpiar</button>
      </div>
    </>
  )
}