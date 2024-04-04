'use client'
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
  FormHelperText,
  Grid,
  GridItem,
  Input,
  Select,
} from "@chakra-ui/react";
import { CUIAutoComplete } from 'chakra-ui-autocomplete';
import { useHousingForm } from "@/hooks/useHousingForm";
import { useHousingConstants } from "@/hooks/useHousingConstants";


const HousingForm: FC<CardProps> = (props: CardProps) => {
  const [statesOptions, setStatesOptions] = useState<{label: string, value: string}[]>([]);

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
  } = useHousingConstants();

  const isLoading = loadingConstants || loading;

  useEffect(() => {
    if (!constants && !loadingConstants)
      fetchConstants();
  }, []);

  useEffect(() => {
    if (!constants && !filter.country)
      setStatesOptions([]);
    else
      setStatesOptions(
        constants?.find(
          (country) => country.baseUri === filter.country
        )?.states?.map((state) => ({
          label: state.name,
          value: state.abbreviation
        })) || []
      );
  }, [filter.country || '', constants]);

  function onSubmit() {
    fetchData();
    window.scrollBy(0, window.innerHeight);
    // window.scrollTo({top: window.innerHeight, behavior: 'smooth'});
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
        <GridItem area='country'>
          <FormControl isDisabled={isLoading}>
            <FormLabel>Country</FormLabel>
            <Select placeholder='Select a country'
              onChange={(e) => setCountry(e.target.value)}
              value={filter.country || ''}
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
        <GridItem area='states'>
          <FormControl isDisabled={isLoading} mb='-40px'>
            <FormLabel mb='-13px'>State(s)</FormLabel>
            <CUIAutoComplete
              disableCreateItem
              placeholder="Specify one or more states"
              items={statesOptions}
              selectedItems={
                statesOptions.filter(
                  (state) => filter.states?.includes(state.value)
                ) || []
              }
              onSelectedItemsChange={(changes) => {
                if (changes.selectedItems)
                  setStates(changes.selectedItems?.map((item) => item.value) || [])
              }}
              listStyleProps={{
                position: 'absolute',
                zIndex: '20',
                maxH: '250px',
                overflowY: 'auto',
                width: '100%',
              }}
            />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
        </GridItem>
        <GridItem area='initial'>
          <FormControl isDisabled={isLoading}>
            <FormLabel>From</FormLabel>
            <Input
              type='month'
              placeholder='Select an (initial) month'
              onChange={(e) => setInitialMonth(e.target.value)}
              value={filter.initialMonth || ''}
            />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
        </GridItem>
        <GridItem area='final'>
          <FormControl isDisabled={isLoading || !filter.initialMonth}>
            <FormLabel>To</FormLabel>
            <Input
              type='month'
              placeholder='Select a (final) month'
              onChange={(e) => setFinalMonth(e.target.value)}
              value={filter.finalMonth || ''}
            />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
        </GridItem>
        <GridItem area='buttons' mt='1em'>
          <ButtonGroup w='100%' justifyContent='stretch' isDisabled={isLoading}>
            <Button w='100%' onClick={() => clearFilter()}>Clear</Button>
            <Button _hover={{
                background: 'orange.700',
              }}
              bg='orange.500'
              color='white'
              bgGradient='linear(to-l, orange.600, orange.400)'
              w='100%'
              onClick={onSubmit}
              isLoading={isLoading}
            >
              Submit
            </Button>
          </ButtonGroup>
        </GridItem>
      </Grid>
    </CardBody>
  </Card>;
}

export default HousingForm;
