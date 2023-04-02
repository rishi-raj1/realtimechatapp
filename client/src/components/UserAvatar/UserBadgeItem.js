import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box
            px='8px'
            py='8px'
            borderRadius='lg'
            m='4px'
            mb='8px'
            variant='solid'
            fontSize='16px'
            bg='purple'
            color='white'
            cursor='pointer'
            onClick={handleFunction}
        >
            {user.name}
            <CloseIcon ml='8px' boxSize='12px' />
        </Box>
    )
}

export default UserBadgeItem