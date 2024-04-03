import { FC } from "react";
import {
  CircularProgress,
  Stack,
  StackProps,
  Text
} from "@chakra-ui/react";
import { HousingDataType } from "@/types";
import HousingDataGroup from "./HousingDataGroup";


interface HousingDataSectionType extends StackProps {
  housingData: HousingDataType[];
  isLoading?: boolean;
}


const HousingDataSection: FC<HousingDataSectionType> = ({
  housingData,
  isLoading,
  ...props
}: HousingDataSectionType) => {
  return <Stack alignItems='center' w='100%' pt='2em' pb='50px' {...props}>
    {housingData.length > 0
      ? housingData.map(
        (group, index) => <HousingDataGroup key={index} {...group} />)
      : isLoading ? <Stack>
          <Text>Fetching housing data...</Text>
          <CircularProgress isIndeterminate color='#A75235' />
        </Stack>
      : <Text>
          Use the form above fetch the housing data. The results will be displayed here.
      </Text>
    }
  </Stack>;
}

export default HousingDataSection;
