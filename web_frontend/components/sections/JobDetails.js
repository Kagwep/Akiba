'use client'

import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  VisuallyHidden,
  List,
  ListItem,
  Badge,
  Divider,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
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
  Divider,
  HStack,
  Tag,
  Wrap,
  WrapItem,
  SpaceProps,
} from '@chakra-ui/react'
import { MdLocalShipping } from 'react-icons/md'
import { useParams} from 'react-router-dom';
import React,{useState,useEffect} from 'react';
import { Link } from "react-router-dom";
import Select from 'react-select';
import { uploadToIPFS } from "~/Infura";
import { utils } from 'near-api-js';

export default function JobDetails({ isSignedIn, wallet , contractId}) {

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [job, setJob] = useState([]);
  const [bids, setBids] = useState([]);


  const params = useParams();

  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedBidId, setSelectedBidId] = useState(0);
  const [uiPleaseWait, setUiPleaseWait] = useState(true);

  const handleTabChange = (index,bid_id) => {
    setSelectedTab(index);
    setSelectedBidId(bid_id);
  };

  useEffect(() => {
  
    getJob().then(setJob);
    getBids().then(setBids);

  }
  , []);


  function BidTag(props) {
    const { marginTop = 0, tags } = props;
  
    const tagElements = tags.map((tag) => {
      return (
        <Tag size={'md'} variant="solid" colorScheme="orange" key={tag}>
          {tag}
        </Tag>
      );
    });
  
    return <HStack spacing={2} marginTop={marginTop}>{tagElements}</HStack>;
  }
  
  function BidOwner(props) {
    return (
      <HStack marginTop="2" spacing="2" display="flex" alignItems="center" marginBottom="2">
        <Text fontWeight="medium">{props.name}</Text>
        <Text>—</Text>
        <Text>{props.date.toLocaleDateString()}</Text>
      </HStack>
    );
  }

  const linkStyle = {
    textDecoration: 'none', // Remove underline
    color: 'blue', // Change the text color to blue
    // Add any other styles you want here
  };

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const new_job_id =Number(params.id)

  const [formData, setFormData] = useState({
    job_id: new_job_id,
    bid_id:1,
    account_id: wallet.accountId,
    bid_description: '',
    budget: 0,
    relevant_files: [],
    bid_approved: false,
  });

  const [formDataMilestone, setFormDataMilestone] = useState({
    job_id: new_job_id,
    bid_id:selectedBidId,
    milestone_id:1,
    milestone_name:'',
    account_id: wallet.accountId,
    milestone_description: '',
    milestone_budget: 0,
    milestone_duration: 0,
    milestone_work_approved: false,
  });

  // pub job_id:u128,
  // pub bid_id: u128,
  // pub milestone_id: u128,
  // pub milestone_name: String,
  // pub milestone_description: String,
  // pub milestone_budget: u128,
  // pub milestone_duration: u128,
  // pub milestone_work_approved: bool,

  // pub job_id: u128,
  // pub bid_id: u128,
  // pub account_id: AccountId,
  // pub bid_description: String,
  // pub budget: u128,
  // pub relevant_files: Vec<String>,
  // pub bid_approved: bool,

  function getJob() {
    console.log(contractId)
    const job_id = Number(params.id);
    return wallet.viewMethod({ method: "get_client_job", args: {job_id:job_id}, contractId });

  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 
  const OnChangeMFile = async (selectedFiles) => {
    // Placeholder logic: Upload files to IPFS
    const uploadedUrls = [];

    for (const file of selectedFiles) {
      const response = await uploadToIPFS(file); // Your actual IPFS upload function
      uploadedUrls.push(response);
    }

    // Placeholder logic: Handle changes, such as updating URLs
    console.log("Uploaded URLs:", uploadedUrls);
    setFormData({ ...formData, relevant_files: uploadedUrls }); // Update the images array in formData
  };

  const handleSubmitBid = async () => {
    // Call the NEAR Protocol function to post the job
    // await postJobToSmartContract(formData);
    // const jsonData = JSON.stringify(updatedFormData);

    

      const updatedFormData = {
        ...formData,
        budget: Number(formData.budget), // Convert project_budget to a number
      };

        wallet
        .callMethod({
        method: "create_freelancer_bid",
        args: {
          job_id: updatedFormData.job_id,
          bid_id:updatedFormData.bid_id,
          account_id:wallet.accountId,
          bid:updatedFormData
        },
        contractId:contractId
        })
        .then(async () => {
        return getBids();
        })
        .then(setBids)
        .finally(() => {
        setUiPleaseWait(false);
        });
      
    setFormData(updatedFormData);
    onClose(); // Close the modal after posting the job
  };


  const handleSubmitApprove = async (job_id,bid_id) => {
    // Call the NEAR Protocol function to post the job
    // await postJobToSmartContract(formData);
    // const jsonData = JSON.stringify(updatedFormData);

        wallet
        .callMethod({
        method: "accept_freelancer_bid",
        args: {
          job_id: job_id,
          bid_id: bid_id
        },
        contractId:contractId
        })
        .then(async () => {
        return getBids();
        })
        .then(setBids)
        .finally(() => {
        setUiPleaseWait(false);
        });
    
    onClose(); // Close the modal after posting the job
  };


  const handleSubmitMilestone = async (job_id,bid_id) => {
    // Call the NEAR Protocol function to post the job
    // await postJobToSmartContract(formData);
    // const jsonData = JSON.stringify(updatedFormData);

        wallet
        .callMethod({
        method: "accept_freelancer_bid",
        args: {
          job_id: job_id,
          bid_id: bid_id
        },
        contractId:contractId
        })
        .then(async () => {
        return getBids();
        })
        .then(setBids)
        .finally(() => {
        setUiPleaseWait(false);
        });
    
    onClose(); // Close the modal after posting the job
  };

  function getBids() {
		console.log(contractId)
    const job_id = Number(params.id);
		return wallet.viewMethod({ method: "get_freelancer_bids_by_job", args: {job_id:job_id}, contractId});
	
	  }

  console.log(job);
  console.log("Bids",bids);

  return (
    <Container maxW={'7xl'}>
      <SimpleGrid
        columns={{ base: 1, lg: 1 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={'header'}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
              {job.project_title}
            </Heading>
            <Text
              color={useColorModeValue('gray.900', 'gray.400')}
              fontWeight={300}
              fontSize={'2xl'}>
              {job.project_budget} NEAR
            </Text>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={'column'}
            divider={
              <StackDivider borderColor={useColorModeValue('gray.200', 'gray.600')} />
            }>
            <VStack spacing={{ base: 4, sm: 6 }}>
              <Text
                color={useColorModeValue('gray.500', 'gray.400')}
                fontSize={'2xl'}
                fontWeight={'300'}>
                {job.account_id}
              </Text>
              <Text fontSize={'lg'}>
                {job.project_description}
              </Text>
            </VStack>
            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}>
                Skill Requirements
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <List spacing={2}>
                  {job && job.skill_requirements ? (
                    job.skill_requirements.map((skill, skillIndex) => (
                      <div key={skillIndex}>
                        <ListItem>{skill}</ListItem>
                      </div>
                    ))
                  ) : (
                    // Render a placeholder or loading message when job is undefined or skill_requirements is missing
                    <div>Loading...</div>
                  )}
              </List>

              <List spacing={2}>
              <Text
                fontSize={{ base: '12px', lg: '12px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}>
                Files
              </Text>

                {job && job.images && job.images.map((file, fileIndex) => (
                  <ListItem key={fileIndex}>
                    <a href={file} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                      File {fileIndex + 1}
                    </a>
                  </ListItem>
                ))}
              </List>

              </SimpleGrid>
            </Box>
            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}>
                Product Details
              </Text>

              <List spacing={2}>
                <ListItem>
                  <Text as={'span'} fontWeight={'bold'}>
                    Project Duration:
                  </Text>{' '}
                  {job.project_duration} hours
                </ListItem>
                <ListItem>
                {job.bid_available ? (
                        <>
                        <Button onClick={onOpen} background={'green'} color={'white'}>Post Bid</Button>
                        <Modal
                          isOpen={isOpen}
                          onClose={onClose}
                          initialFocusRef={initialRef}
                          finalFocusRef={finalRef}
                        >
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>Post Bid</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                  
                              <FormControl mt={4}>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                  name="bid_description"
                                  placeholder="Job description"
                                  value={formData.bid_description}
                                  onChange={handleInputChange}
                                  size="sm"
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>Budget</FormLabel>
                                <Input
                                  type="number"
                                  name="budget"
                                  placeholder="Enter amount"
                                  value={formData.budget}
                                  onChange={handleInputChange}
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>Upload Files</FormLabel>
                                <input type="file" multiple onChange={(e) => OnChangeMFile(Array.from(e.target.files))}/>
                              </FormControl>
                            </ModalBody>
                            <ModalFooter>
                              <Button colorScheme="blue" mr={3} onClick={handleSubmitBid}>
                                Post
                              </Button>
                              <Button onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                        </>
                  ) : (
                    // Render the "Removed" badge when the job is not available
                    <span style={{paddingLeft:'0'}}>
                      <Badge colorScheme='red'>Not Available</Badge>
                    </span>
                  )}
                </ListItem>

              </List>
            </Box>
          </Stack>

        </Stack>
      </SimpleGrid>
      <Tabs index={selectedTab} onChange={handleTabChange}>
        <TabList>
          <Tab _selected={{ color: 'white', bg: 'blue.500' }} color={'black'}>Bids</Tab>
          <Tab _selected={{ color: 'white', bg: 'blue.500' }} isDisabled color={'black'}></Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
          {Object.keys(bids).map((bid, index) => (
          <Box
            display="flex"
            flex="1"
            flexDirection="column"
            justifyContent="center"
            marginTop={{ base: '3', sm: '3', md:'3', lg:'3' }}>
            <BidTag tags={[(bids[bid].budget + ' Near')]} />
            <Text
              as="p"
              marginTop="2"
              color={useColorModeValue('gray.700', 'gray.200')}
              fontSize="lg">
              {bids[bid].bid_description}
            </Text>
            <BidOwner name={bids[bid].account_id} date={new Date('2021-04-06T19:01:27Z')} />
            {bids[bid].bid_approved ? (
              <>
              <span style={{paddingLeft:'3'}}>
                <Badge colorScheme='green'>approved</Badge>
              </span>

              {job.account_id === wallet.accountId || (bids[bid].account_id === wallet.accountId) ? (
                  <Button onClick={() => handleTabChange(1,bids[bid].bid_id)}>Add Milestones</Button>
                ) : (
                  <></> // This can be an empty fragment or any other component
                )}
              
              </>
            
            ) : (
              job.account_id === wallet.accountId ? (

                <>
                <span style={{paddingLeft:'3'}}>
                    <Button onClick={() => handleSubmitApprove(job.job_id,bids[bid].bid_id)} >Approve</Button>
                 </span>
                 </>
              ):(
                <>
                </>
              )
              // Render the "Removed" badge when the job is not available
            )}
          </Box>
            ))}
          </TabPanel>
          <TabPanel>
          <>
            <Button onClick={onOpen} background={'green'} color={'white'}>Add Milestone</Button>
              <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    initialFocusRef={initialRef}
                    finalFocusRef={finalRef}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Milestone</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody pb={6}>
                        <FormControl>
                          <FormLabel>Title</FormLabel>
                          <Input
                            type="text"
                            name="milestone_name"
                            placeholder="Name"
                            value={formDataMilestone.project_title}
                            onChange={handleInputChange}
                          />
                        </FormControl>

                        <FormControl mt={4}>
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            name="milestone_description"
                            placeholder="description"
                            value={formDataMilestone.project_description}
                            onChange={handleInputChange}
                            size="sm"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Duration</FormLabel>
                          <Input
                            type="number"
                            name="milestone_duration"
                            placeholder="Duration in hours"
                            value={formDataMilestone.project_duration}
                            onChange={handleInputChange}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Budget</FormLabel>
                          <Input
                            type="number"
                            name="milestone_budget"
                            placeholder="Enter amount"
                            value={formDataMilestone.project_budget}
                            onChange={handleInputChange}
                          />
                        </FormControl>

                      </ModalBody>
                      <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmitMilestone}>
                          Post
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                        </>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  )
}