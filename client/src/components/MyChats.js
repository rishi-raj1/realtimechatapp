import React, { useEffect, useState } from 'react'

import axios from 'axios';

import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';


import UsersLoading from './UsersLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';
import { ChatState } from '../Context/ChatProvider'

const MyChats = ({ fetchAgain }) => {

    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    const toast = useToast();

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

    // const baseUrl = `http://localhost:5000`;
    const baseUrl = `https://chatappbackend12.onrender.com`;


    const fetchChats = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/api/chat`, config);

            // console.log(data);
            setChats(data);
        } catch (err) {
            toast({
                title: 'Error Occured',
                description: 'Failed to Load the chats',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
        fetchChats();
        // console.log(chats);
    }, [fetchAgain])

    return (
        <Box
            display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
            flexDir='column'
            alignItems='center'
            p='3px'
            bg='white'
            w={{ base: '100%', md: '31%' }}
            borderRadius='lg'
            borderWidth='1px'
        >
            <Box
                pb='3px'
                px='3px'
                fontSize={{ base: '28px', md: '30px' }}
                fontFamily='Work sans'
                display='flex'
                width='100%'
                justifyContent='space-between'
                alignItems='center'
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display='flex'
                        fontSize={{ base: '17px', md: '10px', lg: '17px' }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>

            <Box
                display='flex'
                flexDir='column'
                p='3px'
                bg='#F8F8F8'
                w='100%'
                h='100%'
                borderRadius='lg'
                overflow='hidden'
            >
                {
                    chats ? (
                        <Stack overflowY='scroll'>
                            {
                                chats.map((chat) => (
                                    <Box
                                        onClick={() => setSelectedChat(chat)}
                                        cursor='pointer'
                                        bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                                        px='3px'
                                        py='2px'
                                        borderRadius='lg'
                                        key={chat._id}
                                    >
                                        <Text>
                                            {
                                                !chat.isGroupChat ? (
                                                    getSender(loggedUser, chat.users)
                                                ) : chat.chatName
                                            }
                                        </Text>
                                    </Box>
                                ))
                            }
                        </Stack>
                    ) : (
                        <UsersLoading />
                    )
                }
            </Box>
        </Box>
    )
}

export default MyChats