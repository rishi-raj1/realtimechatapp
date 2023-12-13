import React, { useEffect, useState } from 'react'

import io from 'socket.io-client';
import Lottie from 'lottie-react';
import axios from 'axios';

import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';


import { getSender, getSenderFull } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider'
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';

import './styles.css';
import typinganimation from '../animations/typing.json';

// const ENDPOINT = 'http://localhost:5000';
const ENDPOINT = 'https://chatappbackend12.onrender.com';

var socket, selectedChatCompare;

// const baseUrl = `http://localhost:5000`;
const baseUrl = `https://chatappbackend12.onrender.com`;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [timerId, setTimerId] = useState(null);


    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    const toast = useToast();

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`,
        }
    };


    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, []);


    useEffect(() => {

        fetchMessages();
        if (selectedChatCompare) {
            socket.emit('leave previous chat', selectedChatCompare._id);
        }

        selectedChatCompare = selectedChat;

    }, [selectedChat]);


    useEffect(() => {

        socket.on('message received', (newMessageReceived) => {

            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                // give notification code is below


                let match = notification.some((notif) => notif.chat._id === newMessageReceived.chat._id);

                if (!match) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }

            }
            else {
                setMessages([...messages, newMessageReceived]);
            }
        })
    });



    const fetchMessages = async () => {
        if (!selectedChat) {
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.get(
                `${baseUrl}/api/message/${selectedChat._id}`,
                config
            );


            setMessages(data);
            setLoading(false);
            // console.log(messages);

            socket.emit('join chat', selectedChat._id);


        } catch (err) {
            setLoading(false);

            toast({
                title: 'Error Occured!',
                description: 'Failed to load the Messages',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
        }
    };


    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            socket.emit('stop typing', selectedChat._id);

            try {
                setNewMessage('');

                const { data } = await axios.post(`${baseUrl}/api/message`, {
                    chatId: selectedChat._id,
                    content: newMessage
                }, config);

                // console.log(data);

                socket.emit('new message', data);

                setMessages([...messages, data]);

            } catch (err) {
                toast({
                    title: 'Error Occured!',
                    description: 'Failed to send the Message',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                });
            }
        }
    }


    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // typing indicator logic

        if (!socketConnected) {
            return;
        }


        socket.emit('typing', selectedChat._id);

        const timerLength = 1000;

        if (timerId) {
            clearTimeout(timerId);
        }

        let timer = setTimeout(() => {
            socket.emit('stop typing', selectedChat._id);

        }, timerLength);

        setTimerId(timer);
    }



    return (
        <>
            {
                selectedChat ? (
                    <>
                        <Text
                            fontSize={{ base: '28px', md: '30px' }}
                            pb='12px'
                            px='8px'
                            w='100%'
                            fontFamily='Work sans'
                            display='flex'
                            justifyContent={{ base: 'space-between' }}
                            alignItems='center'
                        >
                            <IconButton
                                display={{ base: 'flex', md: 'none' }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat(null)}
                            />
                            {
                                !selectedChat.isGroupChat ? (
                                    <>
                                        {getSender(user, selectedChat.users)}
                                        <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                    </>
                                ) : (
                                    <>
                                        {
                                            selectedChat.chatName.toUpperCase()
                                        }
                                        <UpdateGroupChatModal
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain}
                                        />
                                    </>
                                )
                            }
                        </Text>

                        <Box
                            display='flex'
                            flexDir='column'
                            justifyContent='flex-end'
                            p='12px'
                            bg='#E8E8E8'
                            w='100%'
                            h='100%'
                            borderRadius='lg'
                            overflowY='hidden'
                        >

                            {
                                loading ? (
                                    <Spinner
                                        size='xl'
                                        w='80px'
                                        h='80px'
                                        alignSelf='center'
                                        margin='auto'
                                    />
                                ) : (
                                    <div className='messages'>
                                        <ScrollableChat messages={messages} />
                                    </div>
                                )
                            }

                            <FormControl onKeyDown={sendMessage} isRequired mt='12px'>
                                {
                                    isTyping ? <div style={{ height: '49px' }}>
                                        <Lottie
                                            animationData={typinganimation}
                                            autoplay='true'
                                            style={{ marginBottom: 15, marginLeft: 0, width: '70px' }}
                                        />
                                    </div> : <div style={{ height: '49px' }}></div>
                                }
                                <Input
                                    variant='filled'
                                    bg='#E0E0E0'
                                    placeholder='Enter a message..'
                                    onChange={typingHandler}
                                    value={newMessage}
                                />
                            </FormControl>
                        </Box>
                    </>
                ) : (
                    <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        h='100%'
                    >
                        <Text
                            fontSize='3xl'
                            pb='12px'
                            fontFamily='Work sans'
                        >
                            Click on a user or group to start Chatting
                        </Text>
                    </Box>
                )
            }
        </>
    )
}

export default SingleChat;