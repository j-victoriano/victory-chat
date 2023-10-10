import React, { useState } from 'react'
import {
    Box, Tooltip, IconButton, Text, Button, Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Avatar,
    AvatarBadge,
    AvatarGroup,
} from '@chakra-ui/react'
import { SearchIcon, ChatIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import ProfileModal from './ProfileModal'

const SidePage = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const { user } = ChatState()

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bg="white"
            w="100%"
            padding="5px 10px"
            borderWidth="5px"
        >
            <Tooltip label="Search for new Chat" placement="bottom-end" hasArrow>
                <Button variant="ghost">
                    <i class="fa fa-search" aria-hidden="true"></i>
                    <Text display={{ base: "none", md: "flex" }} padding="5"> Search for User</Text>
                </Button>
            </Tooltip>
            <Text fontSize="3xl" fontFamily="Work sans">Victory-Chat</Text>
            <div>
                <Menu>
                    <MenuButton padding="1">
                        <ChatIcon fontSize="lg" margin="1" />
                    </MenuButton>
                    {/* <MenuList></MenuList> */}
                </Menu>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user}>
                            <MenuItem>My Profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider />
                        <MenuItem>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box>
    )
}

export default SidePage
