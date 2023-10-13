import React, { useState } from 'react'
import {
    useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    Button,
    useToast,
    Box, FormControl, Input, Spinner,
} from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import UserBadge from '../User/UserBadge'
import axios from 'axios'
import UserListItem from '../User/UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, getMessages }) => {
    const { isOpen, onOpen, onClose, } = useDisclosure()
    const { selectedChat, setSelectedChat, user } = ChatState()
    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const toast = useToast()

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admins can remove a member",
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "top",
            })
            return
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const requestData = {
                chatId: selectedChat._id,
                userId: user1._id
            }
            const { data } = await axios.put('/api/chat/groupremove', requestData, config)

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
            getMessages()
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error occured!",
                description: error.response.data.message,
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "top",
            })
            setLoading(false)
        }
    }

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User Already In Group",
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "top",
            })
            return
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "You cannot add a new member",
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "top",
            })
            return
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const requestData = {
                chatId: selectedChat._id,
                userId: user1._id
            }
            const { data } = await axios.put('/api/chat/groupadd', requestData, config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title: "Unable to add a new member",
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "top",
            })
            setLoading(false)
        }
    }

    const handleRename = async () => {
        if (!groupChatName) return
        try {
            setRenameLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const requestData = {
                chatId: selectedChat._id,
                chatName: groupChatName
            }

            const { data } = await axios.put("/api/chat/rename", requestData, config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            let errorMessage = "Unable to Update Chat"
            if (error.response && error.response.data) {
                errorMessage = error.response.data
            }
            toast({
                title: errorMessage,
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "bottom",
            })
        }
        setGroupChatName('')
    }

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) return
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Unable to Search Result",
                status: "warning",
                duration: 4000,
                isClosable: "true",
                position: "bottom"
            })
        }
    }

    // console.log(selectedChat.users)

    return (
        <>
            <IconButton display="flex" icon={<InfoOutlineIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display="flex"
                        justifyContent={"center"}
                        fontSize="30px"
                        fontStyle="Work sans"
                    >{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users.map(u => (
                                <UserBadge
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={4}
                                mr={2}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme='twitter'
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >Update</Button>
                        </FormControl>
                        <FormControl display="flex">
                            <Input
                                placeholder='Add User to Group'
                                mb={3}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult?.map((u) => (
                                <UserListItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleAddUser(u)}
                                />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal
