'use client'
import React, { FC, useEffect } from "react";
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
import { useHousingConstants } from "@/hooks/useHousingConstants";


const HousingForm: FC<CardProps> = (props: CardProps) => {
  const {
    fetchData,
    loading,
    filter,
    clearFilter,
    setCountry,
    setStates,
    setInitialMonth,
    setFinalMonth
  } = useHousingForm();

  const {
    loading: loadingConstants,
    data: constants,
    fetchData: fetchConstants,
    getCountryName,
    getStateName,
  } = useHousingConstants();

  const isLoading = loadingConstants || loading;

  useEffect(() => {
    if (!constants && !loadingConstants)
      fetchConstants();
  }, []);

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
          <FormControl isDisabled={isLoading}>
            <FormLabel>Country</FormLabel>
            <Select placeholder='Select a country...'
              onChange={(e) => setCountry(e.target.value)}
              value={filter.country || undefined}
            >
              {
                constants?.map((country, index) =>
                  <option key={index} value={country.baseUri}>
                    {country.name}
                  </option>
                )
              }
            </Select>
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
        </GridItem>
        <GridItem area={'states'}>
          <FormControl isDisabled={isLoading}>
            <FormLabel>State(s)</FormLabel>
            <Select>Select the states...</Select>
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
        </GridItem>
        <GridItem area='initial'>
          <FormControl isDisabled={isLoading}>
            <FormLabel>From</FormLabel>
            <Input type='month' placeholder='Select an (initial) month' onChange={(e) => setInitialMonth(e.target.value)} value={filter.initialMonth || undefined} />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
        </GridItem>
        <GridItem area='final'>
          <FormControl isDisabled={isLoading || !filter.initialMonth}>
            <FormLabel>To</FormLabel>
            <Input type='month' placeholder='Select a (final) month' onChange={(e) => setFinalMonth(e.target.value)} value={filter.finalMonth || undefined} />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
        </GridItem>
        <GridItem area='buttons' mt='1em'>
          <ButtonGroup w='100%' justifyContent='stretch' isDisabled={isLoading}>
            <Button w='100%' onClick={() => clearFilter()}>Clear</Button>
            <Button _hover={{
              background: 'orange.300',
            }} bg='orange.400' w='100%' onClick={onSubmit}>Submit</Button>
          </ButtonGroup>
        </GridItem>
      </Grid>
    </CardBody>
  </Card>;
}

export default HousingForm;
