import { FC } from "react";
import {
  Box,
  BoxProps,
  Flex,
  Heading,
  Stat,
  StatArrow,
  StatHelpText,
  Text,
  Wrap,
  WrapItem
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
  const monthText = `${month.substring(5)}/${month.substring(0, 4)}`;
  const finalMonthText = finalMonth ?
    `${finalMonth.substring(5)}/${finalMonth.substring(0, 4)}` : '';

  return <Box {...props}>
    <Flex alignItems='center' justifyContent='flex-start'>
      <Heading>{name}</Heading>
      {variation !== undefined && <>
        <Stat flexGrow={0} ml='1em'>
          <StatHelpText whiteSpace='nowrap' pt='.7em'>
            <StatArrow type={variation >= 0 ? 'increase' : 'decrease'} />
            {(variation * 100).toFixed(3)}%
          </StatHelpText>
        </Stat>
        <Text ml='4em' fontSize='2xl' color='gray.500'>{monthText}{finalMonth && ` - ${finalMonthText}`}</Text>
      </>}
    </Flex>
    <Wrap mt='1em'>
      {data.map((stat, index) => <WrapItem key={index} mr='70px' mb='30px'>
        <HousingDataStat {...stat} />
      </WrapItem>)}
    </Wrap>
  </Box>;
}

export default HousingDataGroup;
