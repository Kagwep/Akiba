'use client'

import React from 'react'
import {
  Stack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Box,
  ListItem,
  List,
  useColorModeValue,
  } from '@chakra-ui/react'
  
import { FcLock,FcCheckmark,FcFile } from 'react-icons/fc'
import { useParams} from 'react-router-dom';
import React,{useState,useEffect} from 'react';
import { uploadToIPFS } from "~/Infura";

export default function ChatsDetails({ isSignedIn, wallet ,contractId}) {

  const [chats, setChats] = useState([]);
  // const [chat, setChat] = useState([]);

  const params = useParams();

  const linkStyle = {
    textDecoration: 'none', // Remove underline
    color: 'blue', // Change the text color to blue
    // Add any other styles you want here
  };


  useEffect(() => {
  
    getChats().then(setChats);
    // getChat().then(setChat);

  }
  , []);


  const { isOpen, onOpen, onClose } = useDisclosure()
  const [uiPleaseWait, setUiPleaseWait] = useState(true);
  
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const timestampInMilliseconds = Date.now();

// Convert it to seconds
  const timestampInSeconds = Math.floor(timestampInMilliseconds / 1000)

 

  const [formData, setFormData] = useState({

    chat_id: 1,
    timestamp:timestampInSeconds,
    sender: '',
    receiver: '',
    message: '',
    attached_files: [],
    seen: true,

  })

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  // const handleSkillChange = (selectedSkills) => {
  //   setFormData({ ...formData, skill_requirements: selectedSkills.map((skill) => skill.label) });
  // };
  

  const OnChangeMFile = async (selectedFiles) => {
    // Placeholder logic: Upload files to IPFS
    const uploadedUrls = [];

    for (const file of selectedFiles) {
      const response = await uploadToIPFS(file); // Your actual IPFS upload function
      uploadedUrls.push(response);
    }

    // Placeholder logic: Handle changes, such as updating URLs
    console.log("Uploaded URLs:", uploadedUrls);
    setFormData({ ...formData, attached_files: uploadedUrls }); // Update the images array in formData
  }; 



  const handleSubmit = async () => {

    const sender = wallet.accountId;

    const updatedFormData = {
      ...formData,
      sender: sender,receiver: params.id
    };


    console.log(updatedFormData);


        wallet
        .callMethod({
        method: "create_chat",
        args: {
          chat_id: updatedFormData.chat_id,
          chat:updatedFormData,
        },
        contractId:contractId
        })
        .then(async () => {
        return  getChats();
        })
        .then(setChats)
        .finally(() => {
        setUiPleaseWait(false);
        });

        setFormData(updatedFormData); 

    onClose(); // Close the modal after posting the job
  };

  function getChats() {
    console.log(contractId)
    const chat_account = params.id;
    console.log("tet",chat_account);
    return wallet.viewMethod({ method: "get_all_chats_for_account", args: {account_id:chat_account}, contractId });

  }


  // function getChat() {
  //   console.log(contractId)
  //   // const chat_account = params.id;
  //   // console.log("tet",chat_account);
  //   return wallet.viewMethod({ method: "get_chat", args: {chat_id:2}, contractId });

  // }
 


  console.log(chats);


  return (
    <Stack p="4" boxShadow="md" m="4" borderRadius="md" width="70%">
      <Stack direction="row" alignItems="center">
        <Text fontWeight="semibold">{params.id}</Text>
      </Stack>

      <Stack direction={{ base: 'column', md: 'column' }} justifyContent="space-between">
      {chats.length > 0 ? (
        chats.map((chat, index) => (
          <div
           key={index}
           style={{
            backgroundColor: chat.sender === wallet.accountId ? 'rgba(255, 255, 250, 0.75)' : 'white', // Set the background color for receiver messages
            width:"100%",
            padding:"10px",
            borderRadius:"10px",
            
          }}
           >
            <Text fontSize={{ base: 'sm' }} textAlign={'left'} maxW={'4xl'}>
              {chat.message}
            </Text>
            <Stack direction={{ base: 'column', md: 'row' }}>
            <List spacing={2}>
              <Text
                fontSize={{ base: '12px', lg: '12px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                paddingTop={5}
                mb={'4'}>
                <FcFile />
              </Text>
            {chat && chat.attached_files && chat.attached_files.map((file, fileIndex) => (
                  <ListItem key={fileIndex}>
                    <a href={file} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                      File {fileIndex + 1}
                    </a>
                  </ListItem>
                ))}

                </List>
  
              
            </Stack>
            <Text color={useColorModeValue('green.500', 'green.300')}>{new Date(chat.timestamp * 1000).toLocaleString()} </Text>
          </div>
        ))
      ) : (
        <p>No chats found</p>
      )}
    </Stack>
      <>
      <Button onClick={onOpen}>new message</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>message</FormLabel>
              <Textarea
                name="message"
                placeholder="message"
                value={formData.message}
                onChange={handleInputChange}
                size="sm"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Attached files</FormLabel>
              <input type="file" multiple onChange={(e) => OnChangeMFile(Array.from(e.target.files))}/>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Send
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    </Stack>
  )
}