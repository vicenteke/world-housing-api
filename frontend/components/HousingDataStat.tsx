import { FC } from "react";
import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  StatProps,
} from "@chakra-ui/react";
import { HousingDataStatsType } from "@/types";


interface HousingDataStatType extends StatProps, HousingDataStatsType {}


const HousingDataStat: FC<HousingDataStatType> = ({
  month,
  squareMeterPrice,
  variation,
  ...props
}: HousingDataStatType) => {
  return <Stat {...props}>
    <StatLabel>{month}</StatLabel>
    <StatNumber>{squareMeterPrice} $/m²</StatNumber>
    <StatHelpText>
      <StatArrow type={variation >= 0 ? 'increase' : 'decrease'} />
      {(variation * 100).toFixed(3)}%
    </StatHelpText>
  </Stat>;
}

export default HousingDataStat;
