import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import { getSender } from '../config/ChatLogic'
import { useToast, Box, Button, Stack, Text } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { ChatState } from '../Context/ChatProvider'

const MyChats = () => {
    const [loggedUser, setLoggedUser] = useState()
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState()

    const toast = useToast()

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const { data } = await axios.get("/api/chat", config)
            console.log(data)
            setChats(data)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
        fetchChats()
    }, [])

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "30%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            > My Chats
                <Button
                    display="flex"
                    fontSize={{ base: "15px", md: "10px", lg: "15px" }}
                    rightIcon={<AddIcon />}
                >
                    Create a Group Chat
                </Button>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                p={3}
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY={'hidden'}
            >
                {chats ? (
                    <Stack overflowY='scroll'>
                        {chats.map((chat) => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                bg={selectedChat === chat ? "lightblue" : "lightgrey"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat ? (
                                        getSender(loggedUser, chat.users)
                                    ) : (chat.chatName)}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    )
}

export default MyChats
