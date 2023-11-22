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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Badge,
} from '@chakra-ui/react'
import { MdLocalShipping } from 'react-icons/md'
import React, { useEffect, useState } from 'react';

export default function TransactionsCard({ isSignedIn, wallet ,contractId}) {

  const [transactions,setTransactions] = useState([]);

  useEffect(() => {
      
    getTransactions().then(setTransactions);

  }
  , []);

  function getTransactions() {
		console.log(contractId)
    const user_account = wallet.accountId;
    return wallet.viewMethod({ method: "get_transactions_for_account", args: {account_id:user_account}, contractId });

	
	  }

     console.log(transactions);

  return (
    <Container maxW={'7xl'}>
      <SimpleGrid
        columns={{ base: 1, lg: 1 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 10, md: 10 }}>
        <Stack spacing={{ base: 6, md: 6 }}>
          <Box as={'header'}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '2xl', lg: '2xl' }}>
              All Transactions
            </Heading>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={'column'}
            divider={
              <StackDivider borderColor={useColorModeValue('gray.200', 'gray.600')} />
            }>
           
            <Box>
              <Text
                fontSize={{ base: '16px', lg: '18px' }}
                color={useColorModeValue('yellow.500', 'yellow.300')}
                fontWeight={'500'}
                textTransform={'uppercase'}
                mb={'4'}>
                --------------
              </Text>
              {Object.keys(transactions).map((transaction, index) => (
              <SimpleGrid key={index} columns={{ base: 1, md: 2 }} spacing={10}>
                <Stat>
                    <StatLabel>{transactions[transaction].transaction_purpose}</StatLabel>
                    <StatLabel color={"grey"}>from: {transactions[transaction].from}</StatLabel>
                    <StatNumber fontSize={15} display={"flex"} >Amount: {transactions[transaction].transaction_amount/1000000000000000000000000} <StatLabel marginLeft={1} color={'green'}>NEAR</StatLabel></StatNumber> 
                    <StatLabel color={"grey"}>to: {transactions[transaction].to}</StatLabel>
                    <StatHelpText>{new Date(transactions[transaction].timestamp/1000000).toLocaleString()}</StatHelpText>
                     <Badge variant='outline' colorScheme='green'>
                      {transactions[transaction].transaction_status}
                    </Badge>
                </Stat>
              </SimpleGrid>
               ))}
            </Box>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  )
}