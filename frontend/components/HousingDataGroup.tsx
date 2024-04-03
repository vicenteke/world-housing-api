import { FC } from "react";
import {
  Box,
  BoxProps,
  Flex,
  Heading,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  Text
} from "@chakra-ui/react";
import { HousingDataType } from "@/types";
import HousingDataStat from "./HousingDataStat";


interface HousingDataGroupType extends BoxProps, HousingDataType {}


const HousingDataGroup: FC<HousingDataGroupType> = ({
  data,
  finalMonth,
  month,
  name,
  variation,
  ...props
}: HousingDataGroupType) => {
  return <Box {...props}>
    <Flex>
      <Heading>{name}</Heading>
      {variation !== undefined && <>
        <Stat {...props}>
          <StatHelpText>
            <StatArrow type={variation >= 0 ? 'increase' : 'decrease'} />
            {(variation * 100).toFixed(3)}%
          </StatHelpText>
        </Stat>
        <Text>{month}{finalMonth && ` - ${finalMonth}`}</Text>
      </>}
    </Flex>
    <StatGroup {...props}>
      {data.map((stat, index) => <HousingDataStat key= {index} {...stat} />)}
    </StatGroup>
  </Box>;
}

export default HousingDataGroup;
