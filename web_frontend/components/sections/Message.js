'use client'

import React,{useEffect,useState} from 'react'
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

 } from '@chakra-ui/react'
import { FcLock } from 'react-icons/fc'
import { Link } from "react-router-dom";
import Select from 'react-select';
import { uploadToIPFS } from "~/Infura";
import { utils } from 'near-api-js';

export default function MessagesCard({ isSignedIn, wallet ,contractId}) {
  

  function generateTo(ChatId) {
    return {
      pathname: `/chat/${ChatId}`,
    };
  }

  const linkStyle = {
    textDecoration: 'none', // Remove underline
    color: 'blue', // Change the text color to blue
    // Add any other styles you want here
  };

  const { isOpen, onOpen, onClose } = useDisclosure()
  
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

  });

//   pub struct Chat {
//     pub chat_id: u128,
//     pub timestamp: u128,
//     pub sender: AccountId,
//     pub receiver: AccountId,
//     pub message: String,
//     pub attached_files: Vec<String>,
//     pub seen: bool,
// }

  
  const [chats,setChats] = useState([]);
	const [uiPleaseWait, setUiPleaseWait] = useState(true);


  useEffect(() => {
  
    getChats().then(setChats);
    // newConnectBalance.nearConnect().then(setAccBalance);
    // viewProfile().then((data) => (setUserProfile(data)));
    // ;

  }
  , []);

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
      sender: sender
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
		 return wallet.viewMethod({ method: "get_all_chat_accounts", contractId});
	
	  }


    const isChatsEmpty = Object.keys(chats).length === 0;

    console.log(isChatsEmpty);

  return (
    <>
     <>
      <Button onClick={onOpen}>new chat</Button>
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
            <FormControl>
              <FormLabel>to</FormLabel>
              <Input
                type="text"
                name="receiver"
                placeholder="to"
                value={formData.receiver}
                onChange={handleInputChange}
              />
            </FormControl>

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
              Post
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    {isChatsEmpty ? (

          <p>No chats available at the moment.</p>
        ) : (
          <Stack
          display="grid"
          gridTemplateColumns={{ base: 'fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap={4}
          marginTop={4}
          marginBottom={4}
        >
                 {Object.keys(chats).map((key, index) => (
                    <Box
                      key={index}
                      p="4"
                      boxShadow="sm"
                      borderRadius="sm"
                      // You can add responsive width here if needed
                      // width={{ base: '100%', md: 'calc(50% - 2rem)', lg: 'calc(33.33% - 2rem)' }}
                    >
                      <Stack direction="row" alignItems="center">
                        <Text fontWeight="semibold">{key}</Text>
                      </Stack>
                      <Stack direction="row">
                        <Link to={generateTo(key)} style={linkStyle}>
                          View
                        </Link>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
        )}

    </>
  )
}