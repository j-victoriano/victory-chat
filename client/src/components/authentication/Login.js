import React from 'react'
import { useToast, FormControl, FormLabel, Input, InputGroup, VStack, InputRightElement, Button } from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

function Login() {
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const history = useHistory()

    const handleClick = () => setShow(!show)

    const submitHandler = async() => {
        setLoading(true)
        if(!email || !password) {
            toast({
                title: "Please fill in all required fields",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return
        }
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const {data} = await axios.post("/api/user/login", {email,password}, config)
            toast({
                title: "Login successful",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            })
            localStorage.setItem("userInfo", JSON.stringify(data))
            setLoading(false)
            history.push("/chats")
        } catch (error) {
            toast({
                title: "Login Error Occured",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
        }
    }

    return (
        <VStack spacing='5px' color="black">
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input placeholder='Please enter your password' value={password}type={show ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} />
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
                isLoading = {loading}
            >Login</Button>
            <Button
                colorScheme='green'
                width="100%"
                style={{ marginTop: 15 }}
                onClick={()=> {
                    setEmail("guest@example.com")
                    setPassword("123456")
                }}
            >Continue as a Guest</Button>
        </VStack>
    )
}

export default Login
