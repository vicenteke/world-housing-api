'use client'
import React, { FC } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Grid,
  GridItem,
  Input,
  Select,
} from "@chakra-ui/react";
import { useHousingForm } from "@/hooks/useHousingForm";


const HousingForm: FC<CardProps> = (props: CardProps) => {
  const {
    fetchData,
    loading,
    filter,
    setCountry,
    setStates,
    setInitialMonth,
    setFinalMonth
  } = useHousingForm();

  function onSubmit() {
    fetchData({
      country: 'brazil',
      states: ['sc-rj'],
      initialMonth: '2023-12',
      finalMonth: '2024-02',
    })
  }

  return <Card {...props}>
    <CardBody>
      <Grid
        templateAreas={`"country country"
                        "states states"
                        "initial final"
                        "buttons buttons"`}
        gap='2'
      >
        <GridItem area={'country'}>
          <FormControl>
            <FormLabel>Country</FormLabel>
            <Select>Select a country...</Select>
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
        </GridItem>
        <GridItem area={'states'}>
          <FormControl>
            <FormLabel>State(s)</FormLabel>
            <Select>Select the states...</Select>
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
        </GridItem>
        <GridItem area='initial'>
          <FormControl>
            <FormLabel>From</FormLabel>
            <Input type='month' placeholder='Select an (initial) month' />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
        </GridItem>
        <GridItem area='final'>
          <FormControl isDisabled>
            <FormLabel>To</FormLabel>
            <Input type='month' placeholder='Select a (final) month' />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
        </GridItem>
        <GridItem area='buttons' mt='1em'>
          <ButtonGroup w='100%' justifyContent='stretch'>
            <Button w='100%'>Cancel</Button>
            <Button bg='orange.400' w='100%' onClick={onSubmit}>Submit</Button>
          </ButtonGroup>
        </GridItem>
      </Grid>
    </CardBody>
  </Card>;
}

export default HousingForm;
