import React from 'react'
import { Box } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'


const UserBadge = ({ user, handleFunction }) => {
    return (
        <Box
            px={2}
            py={2}
            m={2}
            mb={2}
            borderRadius={"lg"}
            variant="solid"
            fontSize="12"
            backgroundColor="darkseagreen"
            color="white"
            cursor="pointer"
            onClick={handleFunction}
        >
            {user.name}
            <CloseIcon paddingLeft={1}/>
        </Box>
    )
}

export default UserBadge
