import React from 'react'
import { FormControl, FormLabel, Input, InputGroup, VStack, InputRightElement, Button } from '@chakra-ui/react'
import { useState } from 'react'

function Login() {
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const handleClick = () => setShow(!show)
    const postDetails = (pics) => { }
    const submitHandler = () => { }

    return (
        <VStack spacing='5px' color="black">
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input placeholder='Please enter your password' type={show ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme='green'
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
            >Login</Button>
            <Button
                colorScheme='green'
                width="100%"
                style={{ marginTop: 15 }}
                onClick={()=> {
                    setEmail("guest@example.com")
                    setPassword("password")
                }}
            >Continue as a Guest</Button>
        </VStack>
    )
}

export default Login
