import React, { useState } from 'react'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { VStack } from '@chakra-ui/layout'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Button } from '@chakra-ui/button'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Signup = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmpassword] = useState('')
    const [pic, setPic] = useState()
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

    const postDetails = (pics) => {
        setLoading(true);

        if (pics === undefined) {

            toast({
                title: 'Please Select an Image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })

            setLoading(false);
            return;
        }

        if (pics.type === 'image/jpeg' || pics.type === 'image/png' || pics.type === 'image/jpg' || pics.type === 'image/jfif') {
            const data = new FormData();

            data.append('file', pics);
            data.append('upload_preset', 'chat-app');
            data.append('cloud_name', 'rishirajjj');

            fetch('https://api.cloudinary.com/v1_1/rishirajjj/image/upload', {
                method: 'post',
                body: data
            }).then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                })
        }
        else {
            toast({
                title: 'Please Select an Image in .png , .jpg , .jpeg, .jfif format',
                status: 'warning',
                duration: 7000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false);
            return;
        }
    }

    const submitHandler = async () => {
        setLoading(true);

        if (!name || !email || !password || !confirmpassword) {
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
        if (password !== confirmpassword) {
            toast({
                title: 'Password do not match!',
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
                `${baseUrl}/api/user`,
                { name, email, password, pic },
                config
            );
            toast({
                title: 'Registration Successful',
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
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter your name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>

            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter your Email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>

                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Enter your Password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='confirm-password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>

                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Enter your Password Again'
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='pic'>
                <FormLabel>Upload Your Picture</FormLabel>
                <Input
                    type='file'
                    p={1.5}
                    accept='image/jpg, image/png, image/jpeg, image/jfif'
                    placeholder='Upload your picture'
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>


            <Button
                colorScheme='blue'
                width='100%'
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup