'use client';
import { ChakraProvider } from '@chakra-ui/react';
import { HousingFormProvider } from '@/hooks/useHousingForm';


export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>
    <HousingFormProvider>
      {children}
    </HousingFormProvider>
  </ChakraProvider>
}
