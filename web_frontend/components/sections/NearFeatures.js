import React from 'react';
import { Box, SimpleGrid, Icon, Text, Stack, Flex } from '@chakra-ui/react';
import { FcAssistant, FcDonate, FcInTransit } from 'react-icons/fc';

function Feature({ title, text, icon }) {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'gray.100'}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
}

export default function CryptoFreelancerWebsite() {
  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
        <Feature
          icon={<Icon as={FcAssistant} w={10} h={10} />}
          title={'Expert Crypto Talent'}
          text={
            'Connect with experienced crypto freelancers who can help you with blockchain development, cryptocurrency trading, and more.'
          }
        />
        <Feature
          icon={<Icon as={FcDonate} w={10} h={10} />}
          title={'Secure Crypto Payments'}
          text={
            'We offer secure cryptocurrency payment options, ensuring that both clients and freelancers can transact safely.'
          }
        />
        <Feature
          icon={<Icon as={FcInTransit} w={10} h={10} />}
          title={'Fast and Reliable Transactions'}
          text={
            'Experience instant delivery of services and transactions thanks to our efficient crypto-based platform.'
          }
        />
      </SimpleGrid>
    </Box>
  );
}
