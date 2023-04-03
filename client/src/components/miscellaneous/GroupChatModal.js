import React, { useState } from 'react'

import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react';

import axios from 'axios';

import { ChatState } from '../../Context/ChatProvider';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';


const GroupChatModal = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();


    const [groupChatName, setGroupChatName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);


    const { user, chats, setChats } = ChatState();

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    };

    const baseUrl = `http://localhost:5000`;


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

    const handleSubmit = async () => {
        const trimmedName = groupChatName.trim();

        if (!groupChatName || !selectedUsers) {
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });

            return;
        }

        try {

            const { data } = await axios.post(
                `${baseUrl}/api/chat/group`,
                {
                    name: trimmedName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id))
                },
                config
            );

            setChats([data, ...chats]);
            setSelectedUsers([]);
            setSearchResult([]);
            setSearch('');

            onClose();
            toast({
                title: 'New Group Chat Created',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
        } catch (err) {
            toast({
                title: 'Failed to Create the Chat',
                description: err.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
        }
    }

    const handleAddUser = (userToAdd) => {
        for (let i = 0; i < selectedUsers.length; i++) {
            if (selectedUsers[i]._id === userToAdd._id) {

                toast({
                    title: 'User already added',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: 'top'
                });

                return;
            }
        }


        setSelectedUsers([...selectedUsers, userToAdd]);
        toast({
            title: 'User added',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top'
        });
    }

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    }

    const handleClose = () => {
        setSearch('');
        setSelectedUsers([]);
        setSearchResult([]);

        onClose();
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose} scrollBehavior='inside'  >
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
                        justifyContent='center'
                        alignItems='center'
                    >
                        Create Group Chat
                        <Text fontSize='20px'>Group Admin: {user.name}</Text>
                    </ModalHeader>
                    {/* <ModalCloseButton /> */}
                    <ModalBody
                        display='flex'
                        flexDir='column'
                        alignItems='center'
                    >
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                mb='12px'
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add Users eg: John, Kane, Jack'
                                value={search}
                                mb='12px'
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>




                        {/* selected users */}
                        <Box
                            w='100%'
                            maxHeight='105px'
                            display='flex'
                            flexWrap='wrap'
                            overflow='auto'
                        >
                            {
                                selectedUsers.map(user => (
                                    <UserBadgeItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleDelete(user)}
                                    />
                                ))
                            }
                        </Box>


                        {/* render searched users */}
                        <Box
                            w='100%'
                            h='270px'
                            marginTop='5px'
                            overflow='auto'
                        >
                            {
                                loading ? <div>loading</div> : (
                                    searchResult?.map(user => (
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
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal