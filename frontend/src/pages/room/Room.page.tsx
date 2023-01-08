import { ReactElement } from "react"
import { Outlet } from "react-router-dom"
import { io } from "socket.io-client"

export function RoomPage(): ReactElement {
  return (
    <div>
      <h1>SALAAA</h1>
      <Outlet />
    </div>
  )
}