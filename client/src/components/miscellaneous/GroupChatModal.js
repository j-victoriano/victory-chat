import React, { useState } from 'react'
import {
    useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button, IconButton, Icon, Image,
    Text,
    useToast,
    FormControl,
    Input, Box
} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../User/UserListItem'
import UserBadge from '../User/UserBadge'

const GroupChatModal = ({ children }) => {
    const { onOpen, isOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    const { user, chats, setChats } = ChatState()

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config)
            console.log(data)
            setLoading(false)
            setSearchResult(data)

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
        }
    }


    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please Enter All Fields",
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "top",
            })
            return
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post('/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, config)

            setChats([data, ...chats])
            onClose()
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 4000,
                isClosable: true,
                position: "bottom",
            })
        } catch (error) {
            toast({
                title: "Unable to Create Chat",
                description: error.response.data ,
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "top",
            })
        }
    }

    const handleDelete = (deletedUser) => {
        setSelectedUsers(
            selectedUsers.filter((sel) => sel._id !== deletedUser._id)
        )
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User Added Already",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            })
            return
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset='slideInBottom' size="sm">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display="flex"
                        justifyContent="center"
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        flexDir="column"
                        display="flex"
                        alignItems="center"
                    >
                        <FormControl>
                            <Input
                                type="text"
                                placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder='Add Users'
                                mb={2}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers.map(user => (
                                <UserBadge key={user._id} user={user} handleFunction={() => handleDelete(user)} />
                            ))}
                        </Box>
                        {loading ? <div>loading</div> : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleGroup(user)}
                                />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create New Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal
