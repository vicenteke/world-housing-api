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
  Text
} from "@chakra-ui/react";
import { CUIAutoComplete } from 'chakra-ui-autocomplete';
import { useHousingForm } from "@/hooks/useHousingForm";
import { useHousingConstants } from "@/hooks/useHousingConstants";

import { ChevronRightIcon } from "@chakra-ui/icons";
import Autocomplete from "./Autocomplete";


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
  return <Card {...props}>
    <CardBody width='300px'>
      <Autocomplete
        options={OPTIONS}
        error='my error message is actually pretty cool.'
        label='Autocomplete'
        help='type in the text you want and select the options that match'
        baseProps={{ isRequired: true, isInvalid: true }}
      />
    </CardBody>
  </Card>;
}

export default HousingForm;
