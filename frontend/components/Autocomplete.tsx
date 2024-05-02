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
  useFormControlProps,
  StackProps,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from "@chakra-ui/icons";

import useAutocomplete, { AutocompleteHookProps } from "../hooks/useAutocomplete";
import AutocompleteTag from "./AutocompleteTag";


export interface AutocompleteOnlyProps extends AutocompleteHookProps {
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  openMenuIcon?: React.ReactElement;
  closeMenuIcon?: React.ReactElement;
  tagProps?: TagProps;
  tagStackProps?: StackProps;
  inputGroupProps?: InputGroupProps;
  inputProps?: InputProps;
  menuProps?: MenuProps;
  menuAnchorRef?: React.MutableRefObject<any>;
  menuListProps?: MenuListProps;
  menuGutter?: number;
  listIcon?: React.ReactElement;
  menuItemProps?: MenuItemProps;

  label?: string | React.ReactElement;
  labelProps?: FormLabelProps;
  help?: string | React.ReactElement;
  helpProps?: FormHelperTextProps;
  error?: string | React.ReactElement;
  errorProps?: FormErrorMessageProps;
}

export type AutocompleteProps = AutocompleteOnlyProps & FormControlProps;


const Autocomplete: FC<AutocompleteProps> = ({
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
  menuGutter,
  menuItemProps,
  menuListProps,
  menuProps,
  openMenuIcon,
  size,
  tagProps,
  tagStackProps,
  ...props
}: AutocompleteProps) => {
  const ref = useRef(null);

  let formControlProps: FormControlProps = {};
  let hookProps: AutocompleteHookProps = {options: props.options};
  const formControlPropsKeys = Object.keys(useFormControlProps({}));
  const formControlPropsEntries: [string, any][] = Object.entries(props).filter(
    (entry) => formControlPropsKeys.includes(entry[0])
  );
  const hookPropsEntries = Object.entries(props).filter(
    (entry) => !formControlPropsKeys.includes(entry[0])
  );

  for (const entry of formControlPropsEntries)
    formControlProps[entry[0] as keyof FormControlProps] = entry[1];

  for (const entry of hookPropsEntries)
    hookProps[entry[0] as keyof AutocompleteHookProps] = entry[1];

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

  return <FormControl {...formControlProps}>
    {label &&
      (typeof label === 'string' ?
      <FormLabel {...labelProps}>{label}</FormLabel>
      : label)
    }

    <Stack
      direction='row'
      flexWrap='wrap'
      width='100%'
      visibility={
        (props.isSingleSelect && ![undefined, null].includes(value))
          || (Array.isArray(value) && value.length > 0)
        ? 'inherit' : 'hidden'
      }
      mb={2}
      {...tagStackProps}
    >
      {Array.isArray(value) ?
        value.map((val) => {
          const option = props.options?.find((item) => item.value === val);
          return <AutocompleteTag
            key={val}
            toggleOption={disabled ? (val: any) => {return} : toggleOption}
            value={val}
            label={option?.label || val}
            {...tagProps}
          />
        })
        : (value && <AutocompleteTag
          toggleOption={disabled ? (val: any) => {return} : toggleOption}
          value={value}
          label={
            props.options?.find((item) => item.value === value)?.label
            || value
          }
          {...tagProps}
        />)
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
      closeOnSelect={props.isSingleSelect}
      {...menuProps}
    >
      <Portal containerRef={menuAnchorRef || ref}>
          <MenuList
            mt={menuGutter === undefined ? 2 : menuGutter}
            {...menuListProps}
          >
            {searchResult.map((option) => (
              <MenuItem
                key={String(option.value)}
                onClick={() => toggleOption(option.value)}
                icon={
                  (props.isSingleSelect && option.value === value) ||
                  (
                    !props.isSingleSelect &&
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
