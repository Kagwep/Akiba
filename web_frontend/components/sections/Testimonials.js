import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';

const Testimonial = (props) => {
  const { children } = props;

  return <Box>{children}</Box>;
};

const TestimonialContent = (props) => {
  const { children } = props;

  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      p={8}
      rounded={'xl'}
      align={'center'}
      pos={'relative'}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: 'solid transparent',
        borderLeftWidth: 16,
        borderRight: 'solid transparent',
        borderRightWidth: 16,
        borderTop: 'solid',
        borderTopWidth: 16,
        borderTopColor: useColorModeValue('white', 'gray.800'),
        pos: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {children}
    </Stack>
  );
};

const TestimonialHeading = (props) => {
  const { children } = props;

  return (
    <Heading as={'h3'} fontSize={'xl'}>
      {children}
    </Heading>
  );
};

const TestimonialText = (props) => {
  const { children } = props;

  return (
    <Text
      textAlign={'center'}
      color={useColorModeValue('gray.600', 'gray.400')}
      fontSize={'sm'}
    >
      {children}
    </Text>
  );
};

const TestimonialAvatar = ({
  src,
  name,
  title,
}) => {
  return (
    <Flex align={'center'} mt={8} direction={'column'}>
      <Avatar src={src} mb={2} />
      <Stack spacing={-1} align={'center'}>
        <Text fontWeight={600}>{name}</Text>
        <Text fontSize={'sm'} color={useColorModeValue('gray.600', 'gray.400')}>
          {title}
        </Text>
      </Stack>
    </Flex>
  );
};

export default function CryptoFreelancerTestimonials() {
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.700')}>
      <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
        <Stack spacing={0} align={'center'}>
          <Heading>Client Testimonials</Heading>
          <Text>What our clients are saying about us.</Text>
        </Stack>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 10, md: 4, lg: 10 }}
        >
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Impressive Crypto Services</TestimonialHeading>
              <TestimonialText>
                "I found the best crypto freelancers on this platform. They delivered outstanding results."
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                'https://res.cloudinary.com/dufdzujik/image/upload/v1697103579/FUN_FOOD/user_1144709_intbgw.png'
              }
              name={'John Doe'}
              title={'Crypto Enthusiast'}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Efficient Cryptocurrency Transactions</TestimonialHeading>
              <TestimonialText>
                "This platform made crypto transactions seamless and secure. Highly recommended!"
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                'https://res.cloudinary.com/dufdzujik/image/upload/v1697103579/FUN_FOOD/user_1144709_intbgw.png'
              }
              name={'Alice Smith'}
              title={'Cryptocurrency Investor'}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Crypto Experts</TestimonialHeading>
              <TestimonialText>
                "I was able to connect with experienced crypto experts who helped me navigate the crypto world."
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                'https://res.cloudinary.com/dufdzujik/image/upload/v1697103579/FUN_FOOD/user_1144709_intbgw.png'
              }
              name={'Emma Johnson'}
              title={'Crypto Consultant'}
            />
          </Testimonial>
        </Stack>
      </Container>
    </Box>
  );
}
