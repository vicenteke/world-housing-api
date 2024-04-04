'use client';
import { ChakraProvider } from '@chakra-ui/react';
import { HousingConstantsProvider } from '@/hooks/useHousingConstants';
import { HousingFormProvider } from '@/hooks/useHousingForm';


export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>
    <HousingConstantsProvider>
      <HousingFormProvider>
        {children}
      </HousingFormProvider>
    </HousingConstantsProvider>
  </ChakraProvider>
}
