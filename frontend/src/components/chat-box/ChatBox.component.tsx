import { Flex, Input, Text } from "@chakra-ui/react"
import React, { ReactElement, useEffect, useState } from "react"
import { emitChatMessage, onChatMessage } from "../../services/io.service"
import { IChatMessage, IChatMessages } from "./chat-box.interfaces"
import styles from "./chat-box.module.css"

export function ChatBox(): ReactElement {
  const [messageInput, setMessageInput] = useState("")
  const [chatMessages, setChatMessages] = useState<IChatMessages>([])
  const username = sessionStorage.getItem("username") as string

  useEffect(() => {
    onChatMessage(updateChatMessages)
  }, [])

  const updateChatMessages = (chatMessage: IChatMessage) => {
    setChatMessages((data) => [...data, chatMessage])
  }

  const handleSendMessage = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    emitChatMessage({
      author: username,
      message: messageInput,
    })
    setMessageInput("")
    updateChatMessages({
      author: username,
      message: messageInput,
    })
  }

  const handleInputMessage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const message = evt.target.value
    setMessageInput(message)
  }

  return (
    <Flex
      w={"100%"}
      maxW={"500px"}
      p={4}
      background={"white"}
      borderRadius={"lg"}
      boxShadow={"lg"}
    >
      <Flex
        flexDirection={"column"}
        gap={4}
        w={"100%"}
        h={"100%"}
        p={3}
        borderRadius={"sm"}
      >
        <Flex
          className={styles.scrollbar}
          flexDirection={"column"}
          h={"100%"}
          overflowY={"scroll"}
        >
          {chatMessages.map((cm) => (
            <Flex color={"black"} gap={2}>
              <Text>{cm.author}:</Text>
              <Text>{cm.message}</Text>
            </Flex>
          ))}
        </Flex>
        <Flex w={"100%"} backgroundColor={""}>
          <form onSubmit={handleSendMessage} style={{ width: "100%" }}>
            <Input
              onChange={handleInputMessage}
              value={messageInput}
              placeholder='escribe aqui...'
              w={"100%"}
              color={"black"}
              variant={""}
              border={"2px solid #bbb"}
              _focus={{ borderColor: "black" }}
            />
          </form>
        </Flex>
      </Flex>
    </Flex>
  )
}
