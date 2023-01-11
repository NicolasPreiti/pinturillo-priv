import { Box, Button, Flex } from "@chakra-ui/react"
import React, { ReactElement, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Socket } from "socket.io-client"
import { ICanvasInfo, ICoords } from "../../interfaces/draw.interface"
import {
  emitCleanCanvas,
  emitCleanPoints,
  emitMousePos,
  initSocket,
  onCleanCanvas,
  onCleanPoints,
  onMousePos,
} from "../../services/io.service"
import { FaEraser } from "react-icons/fa"

type RoomParams = Record<"roomName" | "player", string>

export function Draw(): ReactElement {
  const [strokeColor, setStrokeColor] = useState("black")
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const params = useParams<RoomParams>()
  const canvas = useRef<HTMLCanvasElement>(null)
  let socket: Socket
  let isDrawing = false

  const canvasInfo: ICanvasInfo = {
    width: 600,
    height: 600,
    points: [],
    strokeColor: strokeColor,
  }

  useEffect(() => {
    socket = initSocket(params.roomName as string)
    onMousePos(writePoints)
    onCleanPoints(canvasInfo)
    onCleanCanvas(context, canvasInfo)
  }, [context])

  useEffect(() => {
    if (canvas.current !== null) {
      setContext(canvas.current.getContext("2d"))
      canvas.current.width = canvasInfo.width
      canvas.current.height = canvasInfo.height

      if (context) {
        context.lineWidth = 3
        context.lineCap = "round"
        context.strokeStyle = strokeColor
      }
    }
  }, [context])

  useEffect(() => {
    if (context) {
      context.strokeStyle = strokeColor
    }
  }, [strokeColor])

  const handleStrokeColor = (color: string) => {
    setStrokeColor(color)
  }

  const mouseMove = (evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return

    const { clientX, clientY } = evt
    write({
      x: clientX,
      y: clientY,
    })
  }

  const write = (coord: ICoords): void => {
    if (canvas.current) {
      const rect = canvas.current.getBoundingClientRect()
      const cursorPos = {
        x: coord.x - rect?.left,
        y: coord.y - rect?.top,
      }

      writePoints(cursorPos)
    }
  }

  const writePoints = (
    cursorPos: ICoords,
    emit = true,
    color?: string | undefined
  ) => {
    if (color) {
      setStrokeColor(color)
    }

    canvasInfo.points.push(cursorPos)
    if (emit)
      emitMousePos({
        coords: cursorPos,
        color: strokeColor,
      })

    if (canvasInfo.points.length >= 2) {
      const prev = canvasInfo.points[canvasInfo.points.length - 2]
      const current = canvasInfo.points[canvasInfo.points.length - 1]

      drawOnCanvas(prev, current)
    }
  }

  const drawOnCanvas = (prev: ICoords, current: ICoords) => {
    if (context) {
      context.beginPath()
      context.moveTo(prev.x, prev.y)
      context.lineTo(current.x, current.y)
      context.stroke()
    }
  }

  const startDrawing = (evt: any) => {
    isDrawing = true

    const { clientX, clientY } = evt
    write({
      x: clientX,
      y: clientY,
    })
  }

  const stopDrawing = () => {
    isDrawing = false
    canvasInfo.points = []
    emitCleanPoints()
  }

  const cleanCanvas = () => {
    if (!context) return
    canvasInfo.points = []
    context.clearRect(0, 0, canvasInfo.width, canvasInfo.height)
    emitCleanCanvas()
  }

  return (
    <Flex direction={"column"}>
      <Box
        h={"max-content"}
        borderRadius={"md"}
        overflow={"hidden"}
        boxShadow={"xl"}
      >
        <canvas
          ref={canvas}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          // onMouseLeave={stopDrawing}
          onMouseMove={mouseMove}
          style={{ backgroundColor: "white" }}
        ></canvas>
      </Box>
      <Flex justify={"space-between"} mt={2}>
        <Flex gap={".1rem"}>
          <Button
            onClick={(evt) => setStrokeColor("black")}
            variant={"unstyled"}
            size={"sm"}
            borderRadius={"sm"}
            backgroundColor={"black"}
          ></Button>
          <Button
            onClick={(evt) => setStrokeColor("red")}
            variant={"unstyled"}
            size={"sm"}
            borderRadius={"sm"}
            backgroundColor={"red"}
          ></Button>
          <Button
            onClick={(evt) => setStrokeColor("orange")}
            variant={"unstyled"}
            size={"sm"}
            borderRadius={"sm"}
            backgroundColor={"orange"}
          ></Button>
          <Button
            onClick={(evt) => setStrokeColor("yellow")}
            variant={"unstyled"}
            size={"sm"}
            borderRadius={"sm"}
            backgroundColor={"yellow"}
          ></Button>
          <Button
            onClick={(evt) => setStrokeColor("green")}
            variant={"unstyled"}
            size={"sm"}
            borderRadius={"sm"}
            backgroundColor={"green"}
          ></Button>
          <Button
            onClick={(evt) => setStrokeColor("deepskyblue")}
            variant={"unstyled"}
            size={"sm"}
            borderRadius={"sm"}
            backgroundColor={"deepskyblue"}
          ></Button>
          <Button
            onClick={(evt) => setStrokeColor("blue")}
            variant={"unstyled"}
            size={"sm"}
            borderRadius={"sm"}
            backgroundColor={"blue"}
          ></Button>
          <Button
            onClick={(evt) => setStrokeColor("fuchsia")}
            variant={"unstyled"}
            size={"sm"}
            borderRadius={"sm"}
            backgroundColor={"deeppink"}
          ></Button>
          <Button
            onClick={(evt) => setStrokeColor("gray")}
            variant={"unstyled"}
            size={"sm"}
            borderRadius={"sm"}
            backgroundColor={"gray"}
          ></Button>
        </Flex>

        <Button onClick={cleanCanvas} size={"sm"} borderRadius={"sm"}>
          <FaEraser size={20} />
        </Button>
      </Flex>
    </Flex>
  )
}
