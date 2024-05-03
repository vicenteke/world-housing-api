'use client'
import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
  Input,
  Select,
  Text,
  MenuItem,
} from "@chakra-ui/react";
import { CUIAutoComplete } from 'chakra-ui-autocomplete';
import { useHousingForm } from "@/hooks/useHousingForm";
import { useHousingConstants } from "@/hooks/useHousingConstants";

import { ChevronRightIcon } from "@chakra-ui/icons";
import Autocomplete from "./Autocomplete";

/* TODOs
 * [OK] Fix focus issues
 * [OK] Implement click-away listener
 * [OK] Fix issues when using multiple autocompletes
 * [OK] Improve customizability by allowing passing components to all levels (e.g. MenuItem, Tag, Label, HelperText...)
 * [OK] Check code style/linter
 * [OK] Write comments
 * Write README
 * Transform project into npm package
*/

const renderMenuItemCustom = (props: any) => {
  const {itemKey, onClickHandler, onBlurHandler, option, ...itemProps} = props;
  return <MenuItem key={itemKey} onClick={onClickHandler} onBlur={onBlurHandler} {...itemProps}>
    {option.value}
  </MenuItem>
}


interface Errors {
    country?: string,
    states?: string,
    initialMonth?: string,
    finalMonth?: string,
    fetch?: string;
}

const OPTIONS = [
  {label: 'First Option', value: 1},
  {label: 'Second Option', value: 2},
  {label: 'Third Option', value: 3},
  {label: 'Fourth Option', value: 4},
  {label: 'Fifth Option', value: 5},
]


const HousingForm: FC<CardProps> = (props: CardProps) => {
  const [value, setValue] = useState<number[]>([]);

  return <Card {...props}>
    <CardBody>
      <Autocomplete
        isDisabled
        value={value}
        setValue={setValue}
        options={OPTIONS}
        error='my error message is actually pretty cool.'
        label='Autocomplete'
        help='type in the text you want and select the options that match'
        isRequired
        mb={4}
      />
      <Autocomplete
        value={value}
        setValue={setValue}
        size='xs'
        options={OPTIONS}
        renderMenuItem={renderMenuItemCustom}
        error='my error message is actually pretty cool.'
        label='Autocomplete 2'
        help='type in the text you want and select the options that match'
      />
    </CardBody>
  </Card>;
}

export default HousingForm;
