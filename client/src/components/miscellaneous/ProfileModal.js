import React from 'react'

import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'

import { ViewIcon } from '@chakra-ui/icons';



const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();


    return (
        <>
            {
                children ? (
                    <span onClick={onOpen}>{children}</span>
                ) : (
                    <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
                )
            }

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent height='400px'>
                    <ModalHeader
                        fontSize='30px'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        bgColor='red'
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'
                    >
                        <Image
                            borderRadius='full'
                            boxSize='150px'
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text
                            fontSize={{ base: '28px', md: '30px' }}
                            fontFamily='Work sans'
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal;