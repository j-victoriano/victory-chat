import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import Lottie from 'react-lottie'
import { ChatState } from '../Context/ChatProvider'
import { Text, Box, Spinner, FormControl, Input, useToast } from "@chakra-ui/react"
import { IconButton } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import { getSender, getSenderFull } from '../config/ChatLogic'
import ProfileModal from './miscellaneous/ProfileModal'
import ScrollChat from './ScrollChat'
import animationData from '../animation/typing.json'

const ENDPOINT = 'http://localhost:5000'
let socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const toast = useToast()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            socket.emit('stop typing', selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }

                const requestData = {
                    content: newMessage,
                    chatId: selectedChat._id
                }
                setNewMessage('')
                const { data } = await axios.post('/api/message', requestData, config)
                // console.log(data)
                socket.emit("new chat", data)
                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: "Error Occured",
                    description: "Failed to send message",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                    position: "bottom"
                })
            }
        }
    }

    const getMessages = async () => {
        if (!selectedChat) return

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true)

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)

            // console.log(data)
            setMessages(data)
            setLoading(false)
            socket.emit("join chat", selectedChat._id)
        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to load all messages",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "bottom"
            })
        }
    }

    useEffect(() => {
        getMessages()

        selectedChatCompare = selectedChat
    }, [selectedChat])
    // console.log(notification, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")

    const typeHandler = (e) => {
        setNewMessage(e.target.value)
        if (!socketConnected) return

        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id)
        }
        let lastTyping = new Date().getTime()
        let timer = 3000
        setTimeout(() => {
            let timeNow = new Date().getTime()
            let timeDifference = timeNow - lastTyping
            if (timeDifference >= timer && typing) {
                socket.emit("stop typing", selectedChat._id)
                setTyping(false)
            }
        }, timer)
    }

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", user)
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))
    }, [])

    useEffect(() => {
        socket.on("message received", (newChatRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newChatRecieved.chat._id) {
                if(!notification.includes(newChatRecieved)) {
                    setNotification([newChatRecieved, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessages([...messages, newChatRecieved])
            }

        })
    })

    // console.log(selectedChat.chatName)
    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={"25px"}
                        w="100%"
                        display="flex"
                        color="white"
                        fontWeight="bold"
                        pb={3}
                        px={3}
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat('')}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal 
                                user={getSenderFull(user, selectedChat.users)}
                                
                                />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    getMessages={getMessages}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        backgroundColor="black"
                        p={4}
                        w="100%"
                        h="100%"
                        borderRadius={"lg"}
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                overflowY: "scroll",
                                scrollbarWidth: 'none'
                            }}>
                                <ScrollChat messages={messages} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={5}>
                            {isTyping ? (
                                <div>
                                    <Lottie
                                        options={defaultOptions}
                                        width={70}
                                        height={30}
                                        style={{marginBottom: 15, marginLeft: 0}}
                                    />
                                </div>
                            ) : (<></>)}
                            <Input
                                placeholder='Send Message Here...'
                                borderRadius="lg"
                                borderColor="#696969"
                                variant="filled"
                                onChange={typeHandler}
                                value={newMessage}
                                color="white"
                                backgroundColor="black"
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                >
                    <Text fontSize="2xl" pb={3} fontFamily="Work sans" color="white" fontWeight="bold">
                        Click on a user to start chatting!
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat
