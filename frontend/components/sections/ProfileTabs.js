import React, { useEffect, useState } from 'react';

import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack, // Import VStack for vertical stacking
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  VisuallyHidden,
  List,
  ListItem,
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
  Link,
} from '@chakra-ui/react';
import { MdLocalShipping } from 'react-icons/md';
import * as nearAPI from "near-api-js";
// import { Link } from "react-router-dom";
import Select from 'react-select';
import { uploadToIPFS } from "~/Infura";
import { utils } from 'near-api-js';

export default function ProfileTabs({ isSignedIn, wallet ,contractId}) {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  console.log(wallet.walletSelector.options.network);
  const [freelancer,setFreelancer] = useState();
  const [portfolios,setPortfolios] = useState([]);
  const [experiences,setExperiences] = useState([]);
  const [bal, setBalance] = useState("");

  const { keyStores } = nearAPI;
  const { connect } = nearAPI;
  const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
  const [uiPleaseWait, setUiPleaseWait] = useState(true);



  const connectionConfig = {

    networkId: "testnet",
    keyStore: myKeyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };


  
  const near = "1000000000000000000000000";


    // pub account_id: AccountId,
    // pub profile_image: String,
    // pub full_name: String,
    // pub hourly_rate: u128,
    // pub profession: String,
    // pub payment_preference: String,
    // pub skills: Vec<String>,
    // pub profile_rating: u128,
    // pub is_profile_public: bool,

    const [freelancerFormData, setFreelancerFormData] = useState({
      account_id: wallet.accountId,
      profile_image: [],
      full_name: '',
      hourly_rate: 0,
      profession:'',
      payment_preference:'',
      skills: [],
      profile_rating:0,
      is_profile_public: true,
    });

    // pub portfolio_id:u128,
    // pub account_id: AccountId,
    // pub images: Vec<String>,
    // pub videos: Vec<String>,
    // pub task_url: String,
    // pub description: String,

    const [portfolioFormData, setPortfolioFormData] = useState({
      portfolio_id:0,
      account_id: wallet.accountId,
      images: [],
      videos: [],
      task_url:'',
      description:'',
    });


    const handleFreelancerInputChange = (e) => {
      const { name, value } = e.target;
      setFreelancerFormData({ ...freelancerFormData, [name]: value });
    };

    const handlePortfolioInputChange = (e) => {
      const { name, value } = e.target;
      setPortfolioFormData({ ...portfolioFormData, [name]: value });
    };
  
    const handleFreelancerSkillChange = (selectedSkills) => {
      setFreelancerFormData({ ...freelancerFormData, skills: selectedSkills });
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
      setFreelancerFormData({ ...freelancerFormData, profile_image: uploadedUrls }); // Update the images array in formData
    };

    const OnChangeVideosFile = async (selectedFiles) => {
      // Placeholder logic: Upload files to IPFS
      const uploadedUrls = [];
  
      for (const file of selectedFiles) {
        const response = await uploadToIPFS(file); // Your actual IPFS upload function
        uploadedUrls.push(response);
      }
  
      // Placeholder logic: Handle changes, such as updating URLs
      console.log("Uploaded URLs:", uploadedUrls);
      setPortfolioFormData({ ...portfolioFormData, videos: uploadedUrls }); // Update the images array in formData
    };
  
  const OnChangeImagesFile = async (selectedFiles) => {
      // Placeholder logic: Upload files to IPFS
      const uploadedUrls = [];
  
      for (const file of selectedFiles) {
        const response = await uploadToIPFS(file); // Your actual IPFS upload function
        uploadedUrls.push(response);
      }
  
      // Placeholder logic: Handle changes, such as updating URLs
      console.log("Uploaded URLs:", uploadedUrls);
      setPortfolioFormData({ ...portfolioFormData, images: uploadedUrls }); // Update the images array in formData
    };
  
  
  
    const skillOptions = [
      { value: "html", label: "HTML" },
      { value: "css", label: "CSS" },
      { value: "javascript", label: "JavaScript" },
      { value: "react", label: "React" },
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
      { value: "csharp", label: "C#" },
      { value: "ruby", label: "Ruby" },
      // Add more programming-related skills as needed
    ];

  useEffect(() => {
    // Function to perform the async action
    async function handleAccount() {
      try {
        // Check if the user is signed in
        if (isSignedIn) {
          // Perform the asynchronous action
          const nearConnection = await connect(connectionConfig);
          const account = await nearConnection.account(wallet.accountId);
          const balance = await account.getAccountBalance();
          setBalance(balance);
          getFreelancer().then(setFreelancer);
          getPortfolios().then(setPortfolios);
          getExperiences().then(setExperiences);
          // console.log("alas",balance);
          
          // const account_details = await account.getAccountDetails();
          // console.log(account_details);
          // You can add further logic here based on the result
        } else {
          console.log('User is not signed in.');
        }
      } catch (error) {
        // Handle any errors here
        console.error('Error performing async action:', error);
      }
    }

    // Call the function to handle the async action
    handleAccount();
  }, [isSignedIn,wallet]);

  // pub account_id: AccountId,
  // pub profile_image: String,
  // pub full_name: String,
  // pub hourly_rate: u128,
  // pub profession: String,
  // pub payment_preference: String,
  // pub skills: Vec<String>,
  // pub profile_rating: u128,
  // pub is_profile_public: bool,


  function getFreelancer() {
    const freelancer_account = wallet.accountId;
    return wallet.viewMethod({ method: "get_freelancer", args: {account_id:freelancer_account}, contractId });

  }

  function getPortfolios() {
    const freelancer_account = wallet.accountId;
    return wallet.viewMethod({ method: "get_all_freelancer_portfolios_for_account", args: {account_id:freelancer_account}, contractId });

  }
  function getExperiences() {
    const freelancer_account = wallet.accountId;
    return wallet.viewMethod({ method: "get_all_freelancer_experience_for_account", args: {account_id:freelancer_account}, contractId });

  }

  const handleFreelanceSubmit = async () => {
    // Call the NEAR Protocol function to post the job
    // await postJobToSmartContract(formData);
 
	
    const skillLabels = freelancerFormData.skills.map((skill) => skill.label);
    

    console.log(skillLabels);

      // Create a copy of formData with updated skill_requirements
      const updatedFormData = {
        ...freelancerFormData,
        profile_image:freelancerFormData.profile_image[0],
        skills: skillLabels,
        hourly_rate:Number(freelancerFormData.hourly_rate),
        profile_rating:Number(freelancerFormData.profile_rating),
      };
      

    console.log("freelancer data",updatedFormData);

    // const jsonData = JSON.stringify(updatedFormData);

        wallet
        .callMethod({
        method: "create_freelancer",
        args: {
          account_id: updatedFormData.account_id,
          freelancer:updatedFormData,
        },
        contractId:contractId
        })
        .then(async () => {
        return getFreelancer();
        })
        .then(setFreelancer)
        .finally(() => {
        setUiPleaseWait(false);
        });
      


    // Update formData with the modified copy
    setFreelancerFormData(updatedFormData);

    onClose(); // Close the modal after posting the job
  };

  const handlePortfolioSubmit = async () => {
    // Call the NEAR Protocol function to post the job
    // await postJobToSmartContract(formData);

    // const jsonData = JSON.stringify(updatedFormData);


      console.log(portfolioFormData);

        wallet
        .callMethod({
        method: "create_freelancer_portfolio",
        args: {
          portfolio_id: portfolioFormData.portfolio_id,
          portfolio:portfolioFormData,
        },
        contractId:contractId
        })
        .then(async () => {
        return getPortfolios();
        })
        .then(setPortfolioFormData)
        .finally(() => {
        setUiPleaseWait(false);
        });
    

    onClose(); // Close the modal after posting the job
  };


  console.log(freelancer);
  console.log(portfolios);
  console.log(experiences);

  return (
    <Container maxW={'7xl'}>

    <Tabs variant='unstyled'>
      <TabList>
        <Tab _selected={{ color: 'white', bg: 'blue.500' }} color="black">Account</Tab>
        <Tab _selected={{ color: 'white', bg: 'green.400' }} color="black">Portfolio</Tab>
        <Tab _selected={{ color: 'white', bg: 'blue.600' }} color="black">Experience</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>

        <SimpleGrid
        columns={{ base: 1, lg: 1 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 10, md: 10 }}
      >
        <VStack spacing={{ base: 6, md: 6 }}> {/* Wrap your content in VStack */}
          <Box as={'header'} textAlign="left">
          {isSignedIn ? (
            <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '2xl', sm: '2xl', lg: '2xl' }}
              >
                {wallet.accountId}
              </Heading>
            ) : (
              <>
                <p>Please sign in to see the heading.</p>
              </>
              
            )}
            <Text
              color={useColorModeValue('gray.900', 'gray.400')}
              fontWeight={300}
              fontSize={'2xl'}>
              {(bal.available/near).toFixed(5)}  NEAR
            </Text>
          </Box>
          {freelancer === undefined || freelancer === null? (
            <>
            <p>Please update your details</p>
              <Button onClick={onOpen}>Update</Button>
                <Modal
                  isOpen={isOpen}
                  onClose={onClose}
                  initialFocusRef={initialRef}
                  finalFocusRef={finalRef}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Add</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                      <FormControl>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                          type="text"
                          name="full_name"
                          placeholder="full name"
                          value={freelancerFormData.full_name}
                          onChange={handleFreelancerInputChange}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Hourly rate</FormLabel>
                        <Input
                          type="number"
                          name="hourly_rate"
                          placeholder="hourly rate"
                          value={freelancerFormData.hourly_rate}
                          onChange={handleFreelancerInputChange}
                        />
                      </FormControl>

                      <FormControl mt={4}>
                        <FormLabel>Profession</FormLabel>
                        <Textarea
                          name="profession"
                          placeholder="profession"
                          value={freelancerFormData.profession}
                          onChange={handleFreelancerInputChange}
                          size="sm"
                        />
                      </FormControl>

                      <FormControl mt={4}>
                        <FormLabel> Payment preference</FormLabel>
                        <Textarea
                        name="payment_preference"
                        placeholder="payment preference"
                        value={freelancerFormData.payment_preference}
                        onChange={handleFreelancerInputChange}
                        size="sm"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Skills</FormLabel>
                        <Select
                          isMulti
                          options={skillOptions}
                          value={freelancerFormData.skills}
                          onChange={handleFreelancerSkillChange}
                          placeholder="Select skills..."
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Upload Files</FormLabel>
                        <input type="file" onChange={(e) => OnChangeMFile(Array.from(e.target.files))}/>
                      </FormControl>
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="blue" mr={3} onClick={handleFreelanceSubmit}>
                        Post
                      </Button>
                      <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
            </>
        
      ) : (
        <>
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={'column'}
            divider={
              <StackDivider borderColor={useColorModeValue('gray.200', 'gray.600')} />
            }>
            <VStack spacing={{ base: 4, sm: 6 }}>
            <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
              <Image
                borderRadius="full"
                boxSize="40px"
                src={`${freelancer.profile_image}`}
                alt={`Avatar of ${freelancer.full_name}`}
              />
              <Text fontWeight="medium">{freelancer.full_name}</Text>
              <Text>—</Text>
              <Text>{freelancer.account_id}</Text>
            </HStack>
            </VStack>
            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}>
                Account Info
              </Text>

              <SimpleGrid columns={{ base: 2, md: 2 }} spacing={10}>
                <List spacing={2}>
                  <ListItem>Profession</ListItem>
                  <ListItem>Payment Freelancer</ListItem>
                  <ListItem>Hourly Rate</ListItem>
                </List>
                <List spacing={2}>
                  <ListItem color='blue'>{freelancer.profession}</ListItem>
                  <ListItem color='blue'>{freelancer.payment_preference}</ListItem>
                  <ListItem color='blue'>{freelancer.hourly_rate}</ListItem>
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
                Skills
              </Text>

              <List spacing={2}>
                <ListItem>
                {freelancer && freelancer.skills ? (
                    freelancer.skills.map((skill, skillIndex) => (
                      <div key={skillIndex}>
                        <ListItem>{skill}</ListItem>
                      </div>
                    ))
                  ) : (
                    // Render a placeholder or loading message when job is undefined or skill_requirements is missing
                    <div>Loading...</div>
                  )}
                </ListItem>
              </List>
            </Box>
          </Stack>

          </>
          )}
        </VStack>
      </SimpleGrid>
      
        </TabPanel>
        <TabPanel>
        {portfolios.length === 0 ? (
        
        <>
        <p>No portfolio found - </p>
          <Button onClick={onOpen}>add</Button>
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              initialFocusRef={initialRef}
              finalFocusRef={finalRef}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add Portfolio</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel>Task URL</FormLabel>
                    <Input
                      type="text"
                      name="task_url"
                      placeholder="task url"
                      value={portfolioFormData.task_url}
                      onChange={handlePortfolioInputChange}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Descriptiom</FormLabel>
                    <Textarea
                      name="description"
                      placeholder="description"
                      value={portfolioFormData.description}
                      onChange={handlePortfolioInputChange}
                      size="sm"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Upload Files</FormLabel>
                    <input type="file" onChange={(e) => OnChangeImagesFile(Array.from(e.target.files))}/>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Upload videos</FormLabel>
                    <input type="file" onChange={(e) => OnChangeVideosFile(Array.from(e.target.files))}/>
                  </FormControl>

                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={handlePortfolioSubmit}>
                    Post
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
        </>
      ) : (
        <div>
      {portfolios.length > 0 ? (
        portfolios.map((portfolio, index) => (
          <>

                <Stack spacing={{ base: 6, md: 10 }} key={index}>
                <Button onClick={onOpen}>add new</Button>
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              initialFocusRef={initialRef}
              finalFocusRef={finalRef}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add Portfolio</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel>Task URL</FormLabel>
                    <Input
                      type="text"
                      name="task_url"
                      placeholder="task url"
                      value={portfolioFormData.task_url}
                      onChange={handlePortfolioInputChange}
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Descriptiom</FormLabel>
                    <Textarea
                      name="description"
                      placeholder="description"
                      value={portfolioFormData.description}
                      onChange={handlePortfolioInputChange}
                      size="sm"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Upload Files</FormLabel>
                    <input type="file" onChange={(e) => OnChangeImagesFile(Array.from(e.target.files))}/>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Upload videos</FormLabel>
                    <input type="file" onChange={(e) => OnChangeVideosFile(Array.from(e.target.files))}/>
                  </FormControl>

                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={handlePortfolioSubmit}>
                    Post
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
                  <Box as={'header'}>
                  
                  <Link href={portfolio.task_url} color={'green'} isExternal>
                    Task url
                  </Link>
                  </Box>

                  <Stack
                    spacing={{ base: 4, sm: 6 }}
                    direction={'column'}
                    divider={
                      <StackDivider borderColor={useColorModeValue('gray.200', 'gray.600')} />
                    }>
                    <VStack spacing={{ base: 4, sm: 6 }}>
                      <Text fontSize={'lg'}>
                        {portfolio.description}
                      </Text>
                    </VStack>
                    <Box>
                      <Text
                        fontSize={{ base: '16px', lg: '18px' }}
                        color={useColorModeValue('yellow.500', 'yellow.300')}
                        fontWeight={'500'}
                        textTransform={'uppercase'}
                        mb={'4'}>
                        Files
                      </Text>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                        <List spacing={2}>
                        {portfolio && portfolio.images && portfolio.images.map((file, fileIndex) => (
                          <ListItem key={fileIndex}>
                            <a href={file} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                              File {fileIndex + 1}
                            </a>
                          </ListItem>
                        ))}

                        </List>
                        <List spacing={2}>
                        {portfolio && portfolio.videos && portfolio.videos.map((file, fileIndex) => (
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
                    </Box>
                  </Stack>

                </Stack>
             
           
          </>
        ))
        ) : (
          <p>No chats found</p>
        )}
        </div>
      )}
        </TabPanel>
        <TabPanel>
        {experiences.length === 0 ? (
        <p>no experiences found - add</p>
      ) : (
        <div>
          {/* Display freelancer info */}
          <p>Name: {freelancer.name}</p>
          <p>Email: {freelancer.email}</p>
          {/* Add more info fields as needed */}
        </div>
      )}
        </TabPanel>
      </TabPanels>
    </Tabs>

    </Container>
  );
}
