import React from 'react'
import { Box, Avatar, Text } from '@chakra-ui/react'

const UserListItem = ({ user, handleFunction }) => {
    return (
        <Box
            onClick={handleFunction}
            _hover={{
                background: "darkseagreen",
                color: "white",
            }}
            cursor="pointer"
            w="100%"
            display="flex"
            alignItems="center"
            color="black"
            bg="gainsboro"
            px={3}
            py={2}
            mb={3}
            borderRadius="lg"
        >
            <Avatar
                mr={2}
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
            />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize="sm">
                    <b>Email: </b>
                    {user.email}
                </Text>
            </Box>
        </Box>
    )
}

export default UserListItem
