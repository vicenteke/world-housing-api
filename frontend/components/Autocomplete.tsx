'use client'
import React, { FC, useRef } from "react";
import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormLabelProps,
  FormErrorMessage,
  FormErrorMessageProps,
  FormHelperText,
  FormHelperTextProps,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuList,
  MenuItem,
  Portal,
  Stack,
  TagProps,
  InputGroupProps,
  InputProps,
  MenuProps,
  MenuListProps,
  MenuItemProps,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from "@chakra-ui/icons";

import useAutocomplete, { IAutocompleteHook } from "../hooks/useAutocomplete";
import AutocompleteTag from "./AutocompleteTag";


export interface IAutocomplete extends IAutocompleteHook {
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  openMenuIcon?: React.ReactElement;
  closeMenuIcon?: React.ReactElement;
  tagProps?: TagProps;
  inputGroupProps?: InputGroupProps;
  inputProps?: InputProps;
  menuProps?: MenuProps;
  menuAnchorRef?: React.MutableRefObject<any>;
  menuListProps?: MenuListProps;
  listIcon?: React.ReactElement;
  menuItemProps?: MenuItemProps;

  baseProps?: FormControlProps
  label?: string | React.ReactElement;
  labelProps?: FormLabelProps;
  help?: string | React.ReactElement;
  helpProps?: FormHelperTextProps;
  error?: string | React.ReactElement;
  errorProps?: FormErrorMessageProps;
}


const Autocomplete: FC<IAutocomplete> = ({
  baseProps,
  closeMenuIcon,
  disabled,
  error,
  errorProps,
  help,
  helpProps,
  inputGroupProps,
  inputProps,
  label,
  labelProps,
  listIcon,
  menuAnchorRef,
  menuItemProps,
  menuListProps,
  menuProps,
  openMenuIcon,
  size,
  tagProps,
  ...hookProps
}: IAutocomplete) => {
  const ref = useRef(null);
  const {
    value,
    searchString,
    setSearchString,
    optionsExpanded,
    setOptionsExpanded,
    toggleOption,
    searchResult,
    search,
  } = useAutocomplete(hookProps);

  return <FormControl {...baseProps}>
    {label &&
      (typeof label === 'string' ?
      <FormLabel {...labelProps}>{label}</FormLabel>
      : label)
    }

    <Stack
      direction='row'
      flexWrap='wrap'
      width='100%'
      mb={
        (hookProps.isSingleSelect && ![undefined, null].includes(value)) ||
        (Array.isArray(value) && value.length > 0)
        ? 2 : 0
      }
    >
      {Array.isArray(value) ?
        value.map((val) => {
          const option = hookProps.options?.find((item) => item.value === val);
          return <AutocompleteTag
            key={val}
            toggleOption={disabled ? (val: any) => {return} : toggleOption}
            value={val}
            label={option?.label || val}
            {...tagProps}
          />
        })
        : <AutocompleteTag
            toggleOption={disabled ? (val: any) => {return} : toggleOption}
            value={value}
            label={
              hookProps.options?.find((item) => item.value === value)?.label
              || value
            }
            {...tagProps}
          />
      }
    </Stack>
    <InputGroup {...inputGroupProps}>
      <Input
        value={searchString}
        onChange={(e) => {
          setSearchString(e.target.value);
          setOptionsExpanded(true);
          search(e.target.value);
        }}
        onClick={() => setOptionsExpanded(true)}
        size={size}
        disabled={disabled}
        {...inputProps}
      />
      <InputRightElement onClick={() => setOptionsExpanded(!optionsExpanded)}>
        {optionsExpanded ?
          (closeMenuIcon || <ChevronUpIcon />)
          : (openMenuIcon || <ChevronDownIcon />)
        }
      </InputRightElement>
    </InputGroup>

    {!menuAnchorRef && <InputGroup ref={ref} />}

    {help &&
      (typeof help === 'string' ?
      <FormHelperText {...helpProps}>{help}</FormHelperText>
      : help)
    }

    {error &&
      (typeof error === 'string' ?
      <FormErrorMessage {...errorProps}>{error}</FormErrorMessage>
      : error)
    }

    <Menu isOpen={optionsExpanded}
      closeOnSelect={hookProps.isSingleSelect}
      {...menuProps}
    >
      <Portal containerRef={menuAnchorRef || ref}>
          <MenuList mt={2} {...menuListProps}>
            {searchResult.map((option) => (
              <MenuItem
                key={String(option.value)}
                onClick={() => toggleOption(option.value)}
                icon={
                  (hookProps.isSingleSelect && option.value === value) ||
                  (
                    !hookProps.isSingleSelect &&
                    value.find((val: any) => val === option.value)
                  )
                  ? (listIcon || <CheckIcon color='green' />) : undefined
                }
                {...menuItemProps}
              >
                {option.label}
              </MenuItem>
            ))}
          </MenuList>
      </Portal>
    </Menu>
  </FormControl>;
}

export default Autocomplete;
