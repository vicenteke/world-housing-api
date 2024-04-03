'use client'
import { useState } from "react";
import {
  Flex,
  Heading,
  Text
} from "@chakra-ui/react";

import { HousingDataType } from "@/types";
import HousingDataSection from "@/components/HousingDataSection";
import HousingForm from "@/components/HousingForm";


export default function Home() {
  const  [housingData, setHousingData] = useState<HousingDataType[]>([]);
  const  [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <main>
      <Flex
          w='100%' h='100vh'
          bgImage='url(./wiktor-karkocha-WA2uSCbTXkI-unsplash.jpg)'
          bgRepeat='no-repeat'
          bgSize='cover'
          flexDir='column'
          py='5em'
          px='6em'>
        <Heading as='h1' size='3xl' color='#A75235'>
          World Housing API
        </Heading>
        <Text size='xl'>
          Easily access housing data all around the globe in terms of price per square meter and monthly variation.
        </Text>
        <HousingForm
          maxW='lg'
          alignSelf='center'
          mt='4em'
          setData={setHousingData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </Flex>
      <HousingDataSection housingData={housingData} />
    </main>
  );
}
