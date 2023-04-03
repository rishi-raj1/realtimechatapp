import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container, Box, Text, Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react'

import Login from '../components/authentication/Login';
import Signup from '../components/authentication/Signup';


const Homepage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));

        if (user) {
            navigate('/chats');
        }
    }, [navigate]);


    return (
        <Container maxW='xl' centerContent='true'>
            <Box
                display='flex'
                justifyContent='center'
                p={3}
                bg={'white'}
                w='100%'
                m='40px 0 15px 0'
                borderRadius='lg'
                borderWidth='1px'
            >
                <Text fontSize='4xl' color='black'>Talk-A-Tive</Text>
            </Box>
            <Box
                bg='white'
                w='100%'
                p={4}
                borderRadius='lg'
                borderWidth='1px'
            >
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList>
                        <Tab width='50%'>Login</Tab>
                        <Tab width='50%'>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            {<Login />}
                        </TabPanel>
                        <TabPanel>
                            {<Signup />}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Homepage;