import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { VStack } from '@chakra-ui/layout'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Button } from '@chakra-ui/button'
import { useToast } from '@chakra-ui/react'

import axios from 'axios';

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false);


    const toast = useToast();
    const navigate = useNavigate();


    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }

    // const baseUrl = `http://localhost:5000`;
    const baseUrl = `https://chatappbackend12.onrender.com`;

    const handleClick = () => {
        setShow(!show);
    }

    const submitHandler = async () => {
        setLoading(true);

        if (!email || !password) {
            toast({
                title: 'Please fill all the Fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });

            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post(
                `${baseUrl}/api/user/login`,
                { email, password },
                config
            );

            toast({
                title: 'Login Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
        } catch (err) {
            toast({
                title: 'Error Occured!',
                description: err.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });

            setLoading(false);
        }
    }

    return (
        <VStack spacing='5px'>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter your Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>

                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Enter your Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>


            <Button
                colorScheme='blue'
                width='100%'
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Login
            </Button>

        </VStack>
    )
}

export default Login