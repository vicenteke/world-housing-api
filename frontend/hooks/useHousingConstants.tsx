'use client'
import React, { FC, createContext, useContext, useState } from "react";
import axios from "axios";
import { HousingCountryType } from "@/types";


interface HousingConstantsContext {
  loading?: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  data: HousingCountryType[] | null;
  setData: React.Dispatch<React.SetStateAction<HousingCountryType[] | null>>;
  fetchData: () => void;
  getCountryName: (baseUri: string) => string;
  getStateName: (countryBaseUri: string, abbreviation: string) => string;
}

const HousingConstantsContext = createContext<HousingConstantsContext>({} as HousingConstantsContext);

export const HousingConstantsProvider: FC<any> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<HousingCountryType[] | null>(null);

  async function fetchData() {
    if (!process.env.NEXT_PUBLIC_BACKEND_URL)
      throw new Error('BACKEND_URL not set on .env.local');
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/countries`;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 10000)

    const response = await axios.get(url);
    if (response.status !== 200) {
      setLoading(false);
      throw new Error(
        `Failed to fetch housing constants: ${response.statusText}`
      );
    }

    const data = response.data;
    const res: HousingCountryType[] = data.map((item: any) => ({
      name: item.name,
      baseUri: item.base_uri,
      states: item.states?.map((state: any) => (
        {
          name: state.name,
          abbreviation: state.abbreviation
        }
      ))
    }));

    setData(res);
    setLoading(false);

    return res
  }

  function getCountryName(baseUri: string) {
    // Returns country name from baseUri. If no match found, returns baseUri
    if (!data)
      return baseUri

    return data.find(
      (item: HousingCountryType) => item.baseUri === baseUri
    )?.name || baseUri;
  };

  function getStateName(countryBaseUri: string, abbreviation: string) {
    // Returns state name from abbreviation and countryBaseUri. If no match
    // found, returns abbreviation
    if (!data)
      return abbreviation

    return data.find(
      (item: HousingCountryType) => item.baseUri === countryBaseUri
    )?.states?.find(
      (state) => state.abbreviation === abbreviation
    )?.name || abbreviation;
  };

  return (
    <HousingConstantsContext.Provider value={{
        loading,
        setLoading,
        data,
        setData,
        fetchData,
        getCountryName,
        getStateName,
      }}
    >
      {children}
    </HousingConstantsContext.Provider>
)
}

export function useHousingConstants() {
  const context = useContext(HousingConstantsContext);
  if (!context) {
      throw new Error('HousingConstants must be used within an HousingConstantsProvider')
  }

  return context;
}