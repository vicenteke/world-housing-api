'use client'
import React, { FC, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardProps,
  Input,
  Select,
} from "@chakra-ui/react";
import { HousingDataType } from "@/types";


interface HousingFormType extends CardProps {
  isLoading?: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<HousingDataType[]>>;
}


const HousingForm: FC<HousingFormType> = ({
  isLoading,
  setIsLoading,
  setData,
  ...props
}: HousingFormType) => {
  return <Card {...props}>
    <CardBody>
      <Select>Select a country...</Select>
      <Input type='month' placeholder='Select an (initial) month' />
    </CardBody>
  </Card>;
}

export default HousingForm;
