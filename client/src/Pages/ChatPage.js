import { Box } from '@chakra-ui/react'
import { ChatState } from '../Context/ChatProvider'
import SidePage from '../components/miscellaneous/SidePage'
import MyChats from '../components/MyChats'
import ChatWindow from '../components/ChatWindow'

const ChatPage = () => {
    const { user } = ChatState()

    return (
        <div style={{ width: "100%" }}>
            {user && <SidePage />}
            <Box
                display="flex"
                justifyContent="space-between"
                w="90%"
                h="90vh"
                p="20px"
            >
                {user && <MyChats />}
                {user && <ChatWindow />}
            </Box>
        </div>
    )
}

export default ChatPage
