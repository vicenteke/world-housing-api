'use client'
import { useEffect, useState } from "react";
import {
  Container,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text
} from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';

import { HousingDataType } from "@/types";

import HousingDataSection from "@/components/HousingDataSection";
import HousingForm from "@/components/HousingForm";
import { useHousingForm } from "@/hooks/useHousingForm";
import { useHousingConstants } from "@/hooks/useHousingConstants";


export default function Home() {
  const [housingData, setHousingData] = useState<HousingDataType[] | null>(null);
  const { data, loading, filter } = useHousingForm();
  const {
    loading: loadingConstants,
    data: constants,
    fetchData: fetchConstants,
    getCountryName,
    getStateName,
  } = useHousingConstants();

  useEffect(() => {
    if (!constants && !loadingConstants)
      fetchConstants();
  }, []);

  useEffect(() => {
    setHousingData(data?.map((item) => {
      if (filter.states.length > 0)
        return {
          ...item,
          name: getStateName(filter.country || '', item.name)
        }
      else
        return {
          ...item,
          name: getCountryName(item.name)
        }
    }) || null)

  }, [data, data?.length || 0, constants, constants?.length || 0]);

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
        housingData={housingData}
        isLoading={loading || loadingConstants}
      />
    </main>
  );
}
