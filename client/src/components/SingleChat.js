import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from '../Context/ChatProvider'
import { Text, Box, Spinner, FormControl, Input, useToast } from "@chakra-ui/react"
import { IconButton } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import { getSender, getSenderFull } from '../config/ChatLogic'
import ProfileModal from './miscellaneous/ProfileModal'
import ScrollChat from './ScrollChat'

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const toast = useToast()

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
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
                console.log(data)
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

            console.log(data)
            setMessages(data)
            setLoading(false)
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
    }, [selectedChat])

    const typeHandler = (e) => {
        setNewMessage(e.target.value)

    }

    // console.log(selectedChat.chatName)
    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={"28px"}
                        w="100%"
                        display="flex"
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
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
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
                        backgroundColor="gray.200"
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
                                <ScrollChat messages={messages}/>
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired is mt={5}>
                            <Input
                                placeholder='Send Message Here...'
                                variant="filled"
                                onChange={typeHandler}
                                value={newMessage}
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
                    <Text fontSize="2xl" pb={3} fontFamily="Work sans">
                        Click on a user to start chatting!
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat
