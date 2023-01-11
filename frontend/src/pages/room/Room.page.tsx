import { Flex } from "@chakra-ui/react"
import { ReactElement } from "react"
import { Outlet } from "react-router-dom"
import { io } from "socket.io-client"
import { ChatBox } from "../../components/chat-box/ChatBox.component"
import { Draw } from "../../components/draw/Draw.component"

export function RoomPage(): ReactElement {
  return (
    <Flex justifyContent={"center"} gap={4} height={"100vh"} p={5} backgroundColor={"primary.one"}>
      <Draw />
      <ChatBox />
      
      <Outlet />
    </Flex>
  )
}