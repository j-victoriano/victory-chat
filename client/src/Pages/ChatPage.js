import { Box } from '@chakra-ui/react'
import { ChatState } from '../Context/ChatProvider'
import SidePage from '../components/miscellaneous/SidePage'
import MyChats from '../components/MyChats'
import ChatWindow from '../components/ChatWindow'
import { useState } from 'react'

const ChatPage = () => {
    const { user } = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false)

    return (
        <div style={{ width: "100%" }}>
            {user && <SidePage />}
            <Box
                display="flex"
                justifyContent="space-between"
                w="100%"
                h="90vh"
                p="10px"
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatWindow fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}

export default ChatPage
