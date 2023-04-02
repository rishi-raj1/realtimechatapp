import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { Box, Tooltip, Button, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useDisclosure } from '@chakra-ui/react';

import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import UsersLoading from '../UsersLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';

import axios from 'axios';
import NotificationBadge, { Effect } from 'react-notification-badge';



const SideDrawer = () => {
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();

    const navigate = useNavigate();
    const toast = useToast();

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`,
        },
    };

    const baseUrl = `http://localhost:5000`;

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please Enter something in search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            });

            setSearchResult([]);

            return;
        }

        try {
            setLoading(true);

            const { data } = await axios.get(`${baseUrl}/api/user?search=${search}`, config);

            // console.log(data);

            setLoading(false);
            setSearchResult(data);
        } catch (err) {
            toast({
                title: 'Error Occured',
                description: 'Failed to Load the Search Results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });

            setLoading(false);
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const { data } = await axios.post(`${baseUrl}/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }

            setSelectedChat(data);
            setSearch('');
            setSearchResult([]);
            setLoadingChat(false);

            onClose();
        } catch (err) {
            toast({
                title: 'Error fetching the Chat',
                description: err.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });

            setLoadingChat(false);
        }
    }

    const handleClose = () => {
        setSearch('');
        setSearchResult([]);

        onClose();
    }


    return (
        <>
            <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                bg='white'
                w='100%'
                p='5px 10px 5px 10px'
                borderWidth='5px'
            >
                <Tooltip label='Search Users to Chat' hasArrow placement='bottom-end'>
                    <Button variant='ghost' onClick={onOpen}>
                        <i className='fas fa-search' > </i>
                        <Text display={{ base: 'none', md: 'flex' }} px='4' >Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize='2xl' fontFamily='Work sans'>
                    Talk-A-Tive
                </Text>
                <div>
                    <Menu>
                        <MenuButton p='4px'>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize='2xl' m='4px' />
                        </MenuButton>
                        <MenuList pl='8px'>
                            {
                                !notification.length && 'No New Messages'
                            }
                            <Box
                                w='100%'
                                maxHeight='300px'
                                overflow='auto'
                            >
                                {
                                    notification?.map((notif) => (


                                        <MenuItem key={notif._id} onClick={() => {
                                            setSelectedChat(notif.chat);
                                            setNotification(notification.filter((n) => n !== notif));
                                        }}>
                                            {/* {
                                            console.log('notification ka content ', notif)
                                        } */}
                                            {
                                                notif.chat.isGroupChat ?
                                                    `New Message in ${notif.chat.chatName}`
                                                    : `New Message from ${getSender(user, notif.chat.users)}`
                                            }
                                        </MenuItem>
                                    ))
                                }
                            </Box>
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar
                                size='sm'
                                cursor='pointer'
                                name={user.name}
                                src={user.pic}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>

                    </Menu>
                </div>
            </Box>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    {/* <DrawerCloseButton /> */}

                    <DrawerHeader
                        borderBottomWidth='2px'
                        display='flex'
                        justifyContent='space-between'
                    >
                        <Text>
                            Search Users
                        </Text>
                        <Button colorScheme='blue' onClick={handleClose}>
                            Close
                        </Button>
                    </DrawerHeader>

                    <DrawerBody>
                        <Box display='flex' mb='30px'>
                            <Input
                                placeholder='Enter Name'
                                mr='2px'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {
                            loading ? (
                                <UsersLoading />
                            ) : (
                                searchResult.length ?
                                    searchResult.map(user => (
                                        <UserListItem
                                            key={user._id}
                                            user={user}
                                            handleFunction={() => accessChat(user._id)}
                                        />
                                    ))
                                    : (
                                        <Text mt='80px' fontSize='25px' textAlign='center'>
                                            No Users
                                        </Text>
                                    )
                            )
                        }
                        {
                            loadingChat && <Spinner ml='auto' display='flex' />
                        }
                    </DrawerBody>

                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer