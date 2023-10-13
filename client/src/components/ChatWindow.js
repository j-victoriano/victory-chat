import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import SingleChat from './SingleChat'
import { Box } from '@chakra-ui/react'

const ChatWindow = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState()
    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            w={{ base: "100%", md: "69%" }}
            alignItems="center"
            flexDir="column"
            borderRadius="lg"
            borderWidth="1px"
            padding="5"
            backgroundColor="white"
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    )
}

export default ChatWindow
