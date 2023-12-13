import React, { useState } from 'react'

import axios from 'axios';

import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react';


import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import UserListItem from '../UserAvatar/UserListItem'


const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { user, selectedChat, setSelectedChat } = ChatState();

    const [groupChatName, setGroupChatName] = useState('');
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reanameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    };

    // const baseUrl = `http://localhost:5000`;
    const baseUrl = `https://chatappbackend12.onrender.com`;



    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: 'Only Admins can remove someone!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });

            return;
        }


        try {
            setLoading(true);


            const { data } = await axios.put(
                `${baseUrl}/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id
                },
                config
            );



            user1._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (err) {
            setLoading(false);

            toast({
                title: 'Error Occured!',
                description: err.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
        }
    }

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: 'User Already in group',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });

            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only Admins can add someone!',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });

            return;
        }

        try {
            setLoading(true);


            const { data } = await axios.put(
                `${baseUrl}/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);

        } catch (err) {
            setLoading(false);

            toast({
                title: 'Error Occured!',
                description: err.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
        }
    }

    const handleRename = async () => {
        const newName = groupChatName.trim();

        if (!newName) {
            toast({
                title: 'Enter something',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            });

            setGroupChatName('');

            return;
        }

        try {
            setRenameLoading(true);

            const { data } = await axios.put(
                `${baseUrl}/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: newName
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (err) {
            setRenameLoading(false);

            toast({
                title: 'Error Occured',
                description: err.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
        }

        setGroupChatName('');
    }


    const handleSearch = async (query) => {
        query = query.trim();
        setSearch(query);

        if (!query) {
            setSearchResult([]);
            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.get(`${baseUrl}/api/user?search=${query}`, config);
            // console.log(data);

            setLoading(false);
            setSearchResult(data);
        } catch (err) {
            setLoading(false);

            toast({
                title: 'Error Occured',
                description: 'Failed to Load the Search Results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
        }
    }

    const handleClose = () => {
        setSearch('');
        setSearchResult([]);

        onClose();
    }




    return (
        <>
            <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior='inside'>
                <ModalOverlay />
                <ModalContent
                    maxHeight='685px'
                    marginTop='20px'
                >
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work sans'
                        display='flex'
                        flexDir='column'
                        alignItems='center'
                        justifyContent='center'
                    >
                        {selectedChat.chatName}
                        <Text fontSize='20px'>Group Admin: {selectedChat.groupAdmin.name}</Text>
                    </ModalHeader>

                    {/* <ModalCloseButton /> */}

                    <ModalBody>
                        <Box
                            w='100%'
                            maxHeight='105px'
                            display='flex'
                            flexWrap='wrap'
                            pb='12px'
                            overflow='auto'
                        >
                            {
                                selectedChat.users.map(u => (
                                    <UserBadgeItem
                                        key={u._id}
                                        user={u}
                                        handleFunction={() => handleRemove(u)}
                                    />
                                ))
                            }
                        </Box>

                        <FormControl display='flex' marginTop='4px'>
                            <Input
                                placeholder='Chat Name'
                                mb='12px'
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant='solid'
                                colorScheme='teal'
                                ml='4px'
                                isLoading={reanameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add User to group'
                                value={search}
                                mb='4px'
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        <Box
                            w='100%'
                            h='270px'
                            marginTop='5px'
                            overflow='auto'
                        >
                            {
                                loading ? (
                                    <Spinner size='lg' />
                                ) : (
                                    searchResult?.map((user) => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => handleAddUser(user)}
                                        />
                                    ))
                                )
                            }
                        </Box>

                    </ModalBody>

                    <ModalFooter
                        display='flex'
                        justifyContent='space-between'
                    >
                        <Button colorScheme='blue' onClick={handleClose}>
                            Close
                        </Button>

                        <Button colorScheme='red' onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal