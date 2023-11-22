import React,{useState,useEffect} from 'react';
import {
  Box,
  Heading,
  Badge,
  Image,
  Button,
  Divider,
  Text,
  Divider,
  HStack,
  Tag,
  Wrap,
  WrapItem,
  useColorModeValue,
  Container,
  VStack,
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
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  SpaceProps,
} from '@chakra-ui/react';

import { Link } from "react-router-dom";
import Select from 'react-select';
import { uploadToIPFS } from "~/Infura";
import { utils } from 'near-api-js';

function generateTo(JobId) {
  return {
    pathname: `/job/${JobId}`,
  };
}



function JobTags(props) {
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

const linkStyle = {
  textDecoration: 'none', // Remove underline
  color: 'blue', // Change the text color to blue
  // Add any other styles you want here
};

function JobOwner(props) {
  return (
    <HStack marginTop="2" spacing="2" display="flex" alignItems="center">
      <Image
        borderRadius="full"
        boxSize="40px"
        src="https://res.cloudinary.com/dufdzujik/image/upload/v1697103579/FUN_FOOD/user_1144709_intbgw.png"
        alt={`Avatar of ${props.name}`}
      />
      <Text fontWeight="medium">{props.name}</Text>
      <Text>—</Text>
      <Text>{props.date.toLocaleDateString()}</Text>
    </HStack>
  );
}

function JobList({ isSignedIn, wallet ,contractId}) {

  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [formData, setFormData] = useState({
    job_id: 1,
    account_id: wallet.accountId,
    project_title: '',
    project_description: '',
    project_duration: '',
    project_budget: 0,
    skill_requirements: [],
    images: [],
    bid_available: true,
  });


  console.log(wallet.accountId)

//   let mut job = ClientJobs {
//     job_id: job_id,
//     account_id: user.clone(),
//     project_title: "Project 1".to_string(),
//     project_description: "Description of Project 1".to_string(),
//     project_duration: "1 month".to_string(),
//     project_budget: 1000,
//     skill_requirements: vec!["Skill 1".to_string(), "Skill 2".to_string()],
//     images: vec!["Image 1".to_string(), "Image 2".to_string()],
//     bid_available: true,
// };


  const [jobs,setJobs] = useState([]);
	const [uiPleaseWait, setUiPleaseWait] = useState(true);


  useEffect(() => {
  
    getJobs().then(setJobs);
    // newConnectBalance.nearConnect().then(setAccBalance);
    // viewProfile().then((data) => (setUserProfile(data)));
  //   ;

  }
  , []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillChange = (selectedSkills) => {
    setFormData({ ...formData, skill_requirements: selectedSkills });
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
    setFormData({ ...formData, images: uploadedUrls }); // Update the images array in formData
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
    { value: "rust", label: "Rust" },
    { value: "solidity", label: "Solidity" },
    { value: "cairo", label: "Cairo" },
    { value: "truffle", label: "Truffle" },
    // Add more programming-related skills as needed
  ];

  // const [selectedSkills, setSelectedSkills] = useState([]);

  // const handleSkillChange = (selectedOptions) => {
  //   setSelectedSkills(selectedOptions);
  // };

  const handleSubmit = async () => {
    // Call the NEAR Protocol function to post the job
    // await postJobToSmartContract(formData);
    let send_p =parseFloat(formData.project_budget);

		let st = send_p.toString();

		console.log(st)
		
		const deposit = utils.format.parseNearAmount(st);
    const skillLabels = formData.skill_requirements.map((skill) => skill.label);
    

    console.log(skillLabels);

      // Create a copy of formData with updated skill_requirements
      const updatedFormData = {
        ...formData,
        skill_requirements: skillLabels,
        project_budget: Number(formData.project_budget), // Convert project_budget to a number
      };
      

    console.log(updatedFormData);

    // const jsonData = JSON.stringify(updatedFormData);

        wallet
        .callMethod({
        method: "create_client_job",
        args: {
          job_id: updatedFormData.job_id,
          job:updatedFormData,
        },
        contractId:contractId,
        deposit:deposit
        })
        .then(async () => {
        return getJobs();
        })
        .then(setJobs)
        .finally(() => {
        setUiPleaseWait(false);
        });
      


    // Update formData with the modified copy
    setFormData(updatedFormData);

    onClose(); // Close the modal after posting the job
  };

  function getJobs() {
		console.log(contractId)
		return wallet.viewMethod({ method: "get_all_client_jobs", contractId});
	
	  }


  console.log(jobs)


  return (
    <Container maxW={'7xl'} p="12">
      <>
      <Button onClick={onOpen}>Post Job</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Post Job</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                name="project_title"
                placeholder="Title"
                value={formData.project_title}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="project_description"
                placeholder="Job description"
                value={formData.project_description}
                onChange={handleInputChange}
                size="sm"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Duration</FormLabel>
              <Input
                type="text"
                name="project_duration"
                placeholder="Duration in hours"
                value={formData.project_duration}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Budget</FormLabel>
              <Input
                type="number"
                name="project_budget"
                placeholder="Enter amount"
                value={formData.project_budget}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Skills Required</FormLabel>
              <Select
                isMulti
                options={skillOptions}
                value={formData.skill_requirements}
                onChange={handleSkillChange}
                placeholder="Select skills..."
              />
            </FormControl>

            <FormControl>
              <FormLabel>Upload Files</FormLabel>
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
      <Heading as="h6"  padding="0.5rem 0 0">Jobs</Heading>
      {jobs.length > 0 ? (
        jobs.map((job, index) =>
        <Box
          key={index}
          marginTop={{ base: '1', sm: '5' }}
          display="flex"
          flexDirection={{ base: 'column', sm: 'row' }}
          justifyContent="space-between">
          <Box
            display="flex"
            flex="1"
            marginRight="3"
            position="relative"
            alignItems="center">
            <Box
              width={{ base: '100%', sm: '85%' }}
              zIndex="2"
              marginLeft={{ base: '0', sm: '5%' }}
              marginTop="5%">
              <Box textDecoration="none" _hover={{ textDecoration: 'none' }}>
              <TableContainer>
                <Table size='sm'>
                  <Thead>
                    <Tr>
                      <Th>Project Files</Th>
    
                    </Tr>
                  </Thead>
                  <Tbody>
                  {job.images.map((file, fileIndex) => (
                    <Tr key={fileIndex}>
                      <Td>
                        <a href={file} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                          File {fileIndex + 1}
                        </a>
                      </Td>
                    </Tr>
                  ))}

                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th></Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>
              </Box>
            </Box>
            <Box zIndex="1" width="100%" position="absolute" height="100%">
              <Box
                
                opacity="0.4"
                height="100%"
              />
            </Box>
          </Box>
          <Box
            display="flex"
            flex="1"
            flexDirection="column"
            justifyContent="center"
            marginTop={{ base: '3', sm: '0' }}>
            <JobTags tags={job.skill_requirements} />
            <Heading marginTop="2" fontSize={15} textAlign={'left'}>
              <Text textDecoration="none" _hover={{ textDecoration: 'none' }}>
                {job.project_title}
                {job.bid_available ? (
                  <div></div>
                  ) : (
                    // Render the "Removed" badge when the job is not available
                    <span style={{paddingLeft:'3',marginLeft:'3'}}>
                      <Badge colorScheme='red'>Not Available</Badge>
                    </span>
                  )}
              </Text>
            </Heading>
            <Text
              as="p"
              marginTop="2"
              color={useColorModeValue('gray.700', 'gray.200')}
              fontSize="lg">
              {job.project_description}
            </Text>
            <Text textDecoration="none" color={'green'}  _hover={{ textDecoration: 'none' }}>
                Duration: {job.project_duration} hours
            </Text>
            <Text textDecoration="none" marginTop={5} marginBottom={5} _hover={{ textDecoration: 'none' }}>
                Budget: {job.project_budget} <span style={{color:'Highlight'}}>NEAR</span>
            </Text>
            <Link to={generateTo(job.job_id)} style={linkStyle}>
              View
            </Link>
            <JobOwner name={job.account_id} date={new Date('2021-04-06T19:01:27Z')} />
          </Box>
        </Box>
        )
        ) : (
          // If the jobs array is empty, display a message
          <p>No jobs available at the moment.</p>
        )}
        <Divider />
    </Container>
  );
}

export default JobList;
