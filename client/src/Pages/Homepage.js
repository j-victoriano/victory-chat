import { Container, Box, Text, Tab, TabList, TabPanel, TabPanels, Tabs, } from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import Registration from '../components/authentication/Registration'
import React from 'react'

const Homepage = () => {
    return (
        <Container maxW='xl' centerContent>
            <Box
                display='flex'
                justifyContent='center'
                p={3}
                bg={"white"}
                w="100%"
                m='40px 0 15px 0'
                borderRadius='lg'
                borderWidth='1px'
            >
                <Text fontSize='4xl' fontFamily='Work sans' color='black'>Victori-Chat</Text>
            </Box>
            <Box
                bg="white"
                w="100%"
                p={3}
                borderRadius="lg"
                borderWidth="1px"
            >
                <Tabs variant='soft-rounded' colorScheme='green' textColor="black">
                    <TabList mb="1em">
                        <Tab w="50%">Login</Tab>
                        <Tab w="50%">Registration</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login/>
                        </TabPanel>
                        <TabPanel>
                            <Registration/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Homepage
