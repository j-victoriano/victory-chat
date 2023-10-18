import React, { useState, useRef } from 'react'
import axios from 'axios'
import {
    Box, Tooltip, Text, Button, Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Avatar,
    useToast,
    useDisclosure,
    Input,
    Spinner
} from '@chakra-ui/react'
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import { ChatIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import UserListItem from '../User/UserListItem'
import ProfileModal from './ProfileModal'
import ChatLoading from '../ChatLoading'
import { useHistory } from 'react-router-dom'
import { getSender } from '../../config/ChatLogic'
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge'

const SidePage = () => {
    const toast = useToast()
    const history = useHistory()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please enter name in search bar",
                status: "warning",
                duration: 4000,
                isClosable: "true",
                position: "top-left"
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
                position: "bottom-left"
            })
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post('/api/chat', { userId }, config)

            if (!chats.find((c) => c.id === data.id))
                setChats([data, ...chats])
            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.message,
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            })
        }
    }

    const logoutHandler = () => {
        toast({
            title: "Logged out!",
            status: "success",
            duration: 4000,
            isClosable: "true"
        })
        localStorage.removeItem("userInfo")
        history.push("/")
    }

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="black"
                w="auto"
                padding="10px 20px"
                borderWidth="5px"
                borderColor="#696969"
                borderRadius="xl"
                ml={1}
                mr="auto"
            >
                <Tooltip label="Search for new Chat" placement="bottom-end" hasArrow>
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fa fa-search" aria-hidden="true"></i>
                        <Text display={{ base: "none", md: "flex" }} padding="5" color="#696969">Search for User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize="3xl" fontFamily="Work sans" color="white" fontWeight="bold">Victory-Chat</Text>
                <div>
                    <Menu maxW="50px">
                        <MenuButton padding="1">
                            <NotificationBadge
                                size="small"
                                effect={Effect.SCALE}
                                count={notification.length} />
                            <ChatIcon fontSize="lg" margin="1" color="white" />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No new Messages"}
                            {notification.map(notif => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat)
                                        setNotification(notification.filter((n) => n !== notif))
                                    }}>
                                    {notif.chat.isGroupChat ? `New Message from ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton ml={4} as={Button} rightIcon={<ChevronDownIcon />} backgroundColor="#696969">
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList backgroundColor="#696969" color="white" maxW="20px">
                            <ProfileModal user={user} >
                                <MenuItem
                                    backgroundColor="#696969"
                                    border="hidden"
                                >My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem
                                onClick={logoutHandler}
                                backgroundColor="#696969"
                                borderColor="#696969"
                            >Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef}>
                <DrawerContent color="white" backgroundColor="black" borderRadius="lg">
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder='Type here...'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)} />
                            <Button onClick={handleSearch}>Search</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SidePage
