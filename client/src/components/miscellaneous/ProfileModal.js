import React from 'react'
import {
    useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button, IconButton, Icon, Image,
    Text
} from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            {
                children ? (<span onClick={onOpen}>{children}</span>) : (
                    <IconButton
                        display={{ base: "flex" }}
                        icon={<InfoOutlineIcon />}
                        onClick={onOpen}
                    />
                )
            }
            <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom" size="sm">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display="flex"
                        justifyContent="center"
                    >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        flexDir="column"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Image
                            borderRadius="full"
                            boxSize="100px"
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text fontSize="lg" fontFamily="Work sans">Email: {user.email}</Text>
                    </ModalBody>
                    <ModalFooter
                        display="flex"
                        justifyContent="center"
                    >
                        <Button colorScheme='linkedin' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal
