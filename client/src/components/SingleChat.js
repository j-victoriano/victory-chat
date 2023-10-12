import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Text, Box } from "@chakra-ui/react"
import { IconButton } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import { getSender, getSenderFull } from '../config/ChatLogic'
import ProfileModal from './miscellaneous/ProfileModal'

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat } = ChatState()
    console.log(selectedChat.chatName)
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
                            <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                {/* <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    /> */}
                            </>
                        )}
                    </Text>
                    <Box
                    display="flex"
                    flexDir="column"
                    justify-content="flex-end"
                    backgroundColor="gray.200"
                    p={4}
                    w="100%"
                    h="100%"
                    borderRadius={"lg"}
                    overflowY="hidden"
                    >
                        {/* Messages Here */}
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
