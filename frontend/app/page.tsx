'use client'
import {
  Container,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text
} from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';

import HousingDataSection from "@/components/HousingDataSection";
import HousingForm from "@/components/HousingForm";
import { useHousingForm } from "@/hooks/useHousingForm";


export default function Home() {
  const { data, loading } = useHousingForm();

  return (
    <main>
      <Flex
          w='100%' minH='100vh'
          bgImage='url(./wiktor-karkocha-WA2uSCbTXkI-unsplash.jpg)'
          bgRepeat='no-repeat'
          bgSize='cover'
          flexDir='column'
          pt='5em'
          px='6em'>
        <Heading as='h1' size='3xl' color='#A75235'>
          World Housing API
        </Heading>
        <Text size='xl'>
          Easily access housing data all around the globe in terms of price per square meter and monthly variation.
        </Text>
        <Stack h='100%' justifyContent='space-around' flexGrow={2}>
          <HousingForm
            maxW='lg'
            alignSelf='center'
            mt='4em'
          />
          <Container centerContent>
            <IconButton
              as='a'
              aria-label='Scroll down to see the results'
              icon={<ChevronDownIcon />}
              isRound
              bgColor='white'
              size='sm'
              opacity={0.7}
              href='#housing-data-section'
            />
          </Container>
        </Stack>
      </Flex>
      <HousingDataSection
        id='housing-data-section'
        housingData={data}
        isLoading={loading}
      />
    </main>
  );
}
