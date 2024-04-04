'use client'
import { FC, useEffect } from "react";
import {
  CircularProgress,
  Stack,
  StackProps,
  Text
} from "@chakra-ui/react";
import { HousingDataType } from "@/types";
import HousingDataGroup from "./HousingDataGroup";


interface HousingDataSectionType extends StackProps {
  housingData: HousingDataType[] | null;
  isLoading?: boolean;
}


const HousingDataSection: FC<HousingDataSectionType> = ({
  housingData,
  isLoading,
  ...props
}: HousingDataSectionType) => {
  return <Stack w='100%' pt='4em' pb='50px' px='5em' {...props}>
    {isLoading &&
      <Stack alignItems='center'>
        <Text>Fetching housing data...</Text>
        <CircularProgress isIndeterminate color='orange.400' />
      </Stack>
    }
    {housingData === null && !isLoading &&
      <Text textAlign='center'>
        Use the form above fetch the housing data. The results will be displayed here.
      </Text>
    }
    {housingData && !isLoading && <>
      {housingData.length > 0
        ? housingData.map((group, index) => <HousingDataGroup
              key={index}
              mb='2em'
              {...group}
          />
        )
        : <Text textAlign='center'>
            No data found ;(<br />Use the form above fetch the housing data. The results will be displayed here.
        </Text>
      }
    </>}
  </Stack>;
}

export default HousingDataSection;
