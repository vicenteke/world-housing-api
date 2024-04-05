'use client'
import React, { FC, createContext, useContext, useState } from "react";
import axios from "axios";
import { HousingDataType } from "@/types";


interface HousingFormFilter {
  country: string | null;
  states: string[];
  initialMonth: string | null;
  finalMonth: string | null;
}

interface HousingFormContext {
  loading?: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  data: HousingDataType[] | null;
  setData: React.Dispatch<React.SetStateAction<HousingDataType[] | null>>;
  filter: HousingFormFilter;
  setFilter: React.Dispatch<React.SetStateAction<HousingFormFilter>>;
  clearFilter: () => void;
  setCountry: (country: string | null) => HousingFormFilter;
  setStates: (states: string[]) => HousingFormFilter;
  setInitialMonth: (initialMonth: string | null) => HousingFormFilter;
  setFinalMonth: (finalMonth: string | null) => HousingFormFilter;
  fetchData: (_filter?: HousingFormFilter) => void;
}

const HousingFormContext = createContext<HousingFormContext>({} as HousingFormContext);

export const HousingFormProvider: FC<any> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<HousingDataType[] | null>(null);

  const [filter, setFilter] = useState<HousingFormFilter>({
    country: null,
    states: [],
    initialMonth: null,
    finalMonth: null,
  });

  function clearFilter() {
    setFilter({
      country: null,
      states: [],
      initialMonth: null,
      finalMonth: null,
    });
  };

  function setCountry(country: string | null) {
    const newValue = {
      ...filter,
      country,
    };
    setFilter(newValue);
    return newValue;
  };

  function setStates(states: string[]) {
    const newValue = {
      ...filter,
      states,
    };
    setFilter(newValue);
    return newValue;
  };

  function setInitialMonth(initialMonth: string | null) {
    const newValue = {
      ...filter,
      initialMonth,
    };
    setFilter(newValue);
    return newValue;
  };

  function setFinalMonth(finalMonth: string | null) {
    const newValue = {
      ...filter,
      finalMonth,
    };
    setFilter(newValue);
    return newValue;
  };

  async function fetchData(_filter?: HousingFormFilter) {
    if (!_filter)
      _filter = filter;

    let url = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!url)
      throw new Error('BACKEND_URL not set on .env.local');
    if (!_filter.country)
      throw new Error('You must specify the country');
    if (!_filter.initialMonth)
      throw new Error('You must specify a month');

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 10000)

    url += `/${_filter.country}`;
    if (_filter.states.length > 0)
      url += `/${_filter.states.join('-')}`;

    url += `/${_filter.initialMonth.substring(0, 4)}`
      + `/${_filter.initialMonth.substring(5)}`;
    
    if (_filter.finalMonth) {
      url += `/${_filter.finalMonth.substring(0, 4)}`
        + `/${_filter.finalMonth.substring(5)}`;
    }

    let response: any;
    try {
      response = await axios.get(url);
      if (response.status !== 200) {
        setLoading(false);
        throw new Error(`Failed to fetch housing data: ${response.statusText}`);
      }
    } catch (e) {
      setLoading(false);
      throw new Error(`Failed to fetch housing data: ${e}`);
    }

    const data = response.data;
    let res: HousingDataType[] = [];
    if (_filter.states.length === 0) {
      let newEntry = {
        name: _filter.country,
        data: [],
        month: _filter.initialMonth,
        finalMonth: _filter.finalMonth || undefined,
        variation: data.variation
      };

      if (!_filter.finalMonth)
        res.push({
          ...newEntry,
          data: [{
            month: _filter.initialMonth,
            squareMeterPrice: data.square_meter_price,
            variation: data.variation,
          }]
        });
      else {
        res.push({
          ...newEntry,
          data: Object.entries(data.monthly).map((item: any) => ({
            month: item[0],
            squareMeterPrice: item[1].square_meter_price,
            variation: item[1].variation,
          }))
        });
      }
    } else {
      for (const state in data) {
        let newEntry = {
          name: state,
          data: [],
          month: _filter.initialMonth,
          finalMonth: _filter.finalMonth || undefined,
          variation: data[state].variation
        };
  
        if (!_filter.finalMonth)
          res.push({
            ...newEntry,
            data: [{
              month: _filter.initialMonth,
              squareMeterPrice: data[state].square_meter_price,
              variation: data[state].variation,
            }]
          });
        else {
          res.push({
            ...newEntry,
            data: Object.entries(data[state].monthly).map((item: any) => ({
              month: item[0],
              squareMeterPrice: item[1].square_meter_price,
              variation: item[1].variation,
            }))
          });
        }
      }
    }

    setData(res);
    setLoading(false);

    return res
  }

  return (
    <HousingFormContext.Provider value={{
        loading,
        setLoading,
        data,
        setData,
        filter,
        setFilter,
        clearFilter,
        setCountry,
        setStates,
        setInitialMonth,
        setFinalMonth,
        fetchData,
      }}
    >
      {children}
    </HousingFormContext.Provider>
)
}

export function useHousingForm() {
  const context = useContext(HousingFormContext);
  if (!context) {
      throw new Error('HousingForm must be used within an HousingFormProvider')
  }

  return context;
}