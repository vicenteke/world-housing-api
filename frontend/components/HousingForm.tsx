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


interface Errors {
    country?: string,
    states?: string,
    initialMonth?: string,
    finalMonth?: string,
    fetch?: string;
}


const HousingForm: FC<CardProps> = (props: CardProps) => {
  const [statesOptions, setStatesOptions] = useState<{label: string, value: string}[]>([]);
  const [errors, setErrors] = useState<Errors>({});

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

  function validate() {
    const newErrors: Errors = {};

    if (!filter.country)
      newErrors['country'] = 'Field is required';

    if (!filter.initialMonth)
      newErrors['initialMonth'] = 'Field is required';
    else if (filter.initialMonth >= moment().format('YYYY-MM'))
      newErrors['initialMonth'] =
        'Must be less than current month';

    if (filter.finalMonth) {
      if (filter.initialMonth && filter.finalMonth <= filter.initialMonth)
        newErrors['finalMonth'] =
          'Must be greater than initial month';
      else if (filter.finalMonth >= moment().format('YYYY-MM'))
        newErrors['finalMonth'] =
          'Must be less than current month';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function onSubmit() {
    if (validate()) {
      try {
        await fetchData();
        window.scrollTo({top: window.innerHeight, behavior: 'smooth'});
      } catch (e) {
        console.error(e);
        setErrors({
          ...errors,
          fetch: 'Failed to fetch data, you can try different filters'
        })
      }
    }
  }

  return <Card {...props}>
    <CardBody>
      {errors.fetch &&
        <Text color='tomato' w='100%' textAlign='center' mb='10px'>
          {errors.fetch}
        </Text>
      }
      <Grid
        templateAreas={`"country country"
                        "states states"
                        "initial final"
                        "buttons buttons"`}
        gap='2'
      >
        <GridItem area='country'>
          <FormControl isDisabled={isLoading} isRequired isInvalid={!!errors.country}>
            <FormLabel>Country</FormLabel>
            <Select placeholder='Select a country'
              onChange={(e) => {
                setCountry(e.target.value);
                const {country, ...newErrors} = errors;
                setErrors(newErrors);
              }}
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
            <FormErrorMessage>{errors.country}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem area='states'>
          <FormControl isDisabled={isLoading} mb='-40px' isInvalid={!!errors.states}>
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
                  setStates(changes.selectedItems?.map((item) => item.value) || []);
                const {states, ...newErrors} = errors;
                setErrors(newErrors);
              }}
              listStyleProps={{
                position: 'absolute',
                zIndex: '20',
                maxH: '250px',
                overflowY: 'auto',
                width: '100%',
              }}
            />
            <FormErrorMessage>{errors.states}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem area='initial'>
          <FormControl isDisabled={isLoading} isRequired isInvalid={!!errors.initialMonth}>
            <FormLabel>From</FormLabel>
            <Input
              type='month'
              placeholder='Select an (initial) month'
              onChange={(e) => {
                setInitialMonth(e.target.value);
                const {initialMonth, ...newErrors} = errors;
                setErrors(newErrors);
              }}
              value={filter.initialMonth || ''}
            />
            <FormErrorMessage>{errors.initialMonth}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem area='final'>
          <FormControl isDisabled={isLoading || !filter.initialMonth} isInvalid={!!errors.finalMonth}>
            <FormLabel>To</FormLabel>
            <Input
              type='month'
              placeholder='Select a (final) month'
              onChange={(e) => {
                setFinalMonth(e.target.value);
                const {finalMonth, ...newErrors} = errors;
                setErrors(newErrors);
              }}
              value={filter.finalMonth || ''}
            />
            <FormErrorMessage>{errors.finalMonth}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem area='buttons' mt='1em'>
          <ButtonGroup w='100%' justifyContent='stretch' isDisabled={isLoading}>
            <Button w='100%' onClick={() => {
              clearFilter();
              setErrors({});
            }}>
              Clear
            </Button>
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
