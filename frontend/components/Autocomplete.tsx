'use client'
import React, { FC, useRef } from "react";
import ClickAwayListener from 'react-click-away-listener';
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
  StackProps,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from "@chakra-ui/icons";

import useAutocomplete, {
  AutocompleteHookProps,
  AutocompleteHookPropsList
} from "../hooks/useAutocomplete";
import AutocompleteTag from "./AutocompleteTag";


export interface AutocompleteOnlyProps extends AutocompleteHookProps {
  isDisabled?: boolean;
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
  isDisabled,
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
  const defaultMenuAnchorRef = useRef(null);
  const inputRef = useRef(null);

  // split hook props
  let hookProps: AutocompleteHookProps = {options: props.options};
  const hookPropsEntries = Object.entries(props).filter(
    (entry) => AutocompleteHookPropsList.includes(entry[0])
  );

  let formControlProps: FormControlProps = {};
  const formControlPropsEntries: [string, any][] = Object.entries(props).filter(
    (entry) => !AutocompleteHookPropsList.includes(entry[0])
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

  function focusInput() {
    ((inputRef.current as unknown) as HTMLInputElement).focus();
  }

  return <ClickAwayListener onClickAway={() => setOptionsExpanded(false)}>
    <FormControl isDisabled={isDisabled} {...formControlProps}>
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
        mb={3}
        {...tagStackProps}
      >
        {Array.isArray(value) ?
          value.map((val) => {
            const option = props.options?.find((item) => item.value === val);
            return <AutocompleteTag
              key={val}
              toggleOption={isDisabled ? (val: any) => {return} : toggleOption}
              value={val}
              label={option?.label || val}
              inputRef={inputRef}
              {...tagProps}
            />
          })
          : (value && <AutocompleteTag
            toggleOption={isDisabled ? (val: any) => {return} : toggleOption}
            value={value}
            label={
              props.options?.find((item) => item.value === value)?.label
              || value
            }
            inputRef={inputRef}
            {...tagProps}
          />)
        }
      </Stack>
      <InputGroup isDisabled={isDisabled} {...inputGroupProps}>
        <Input
          ref={inputRef}
          value={searchString}
          onChange={(e) => {
            if (searchString !== e.target.value) {
              setSearchString(e.target.value);
              setOptionsExpanded(true);
              search(e.target.value);
    
              // enforce focus
              setTimeout(
                () => focusInput(),
                100
              );
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            setOptionsExpanded(true);
          }}
          size={size}
          isDisabled={isDisabled}
          {...inputProps}
        />
        <InputRightElement
          onClick={(e) => {
            e.stopPropagation();
            setOptionsExpanded(!optionsExpanded)
          }}
        >
          {optionsExpanded ?
            (closeMenuIcon || <ChevronUpIcon />)
            : (openMenuIcon || <ChevronDownIcon />)
          }
        </InputRightElement>
      </InputGroup>

      {!menuAnchorRef && <InputGroup ref={defaultMenuAnchorRef} zIndex='dropdown' position='relative' />}

      {help &&
        (typeof help === 'string' ?
        <FormHelperText isDisabled={isDisabled} {...helpProps}>{help}</FormHelperText>
        : help)
      }

      {error &&
        (typeof error === 'string' ?
        <FormErrorMessage isDisabled={isDisabled} {...errorProps}>{error}</FormErrorMessage>
        : error)
      }

      <Menu isOpen={optionsExpanded}
        closeOnSelect={props.isSingleSelect}
        initialFocusRef={inputRef}
        {...menuProps}
      >
        <Portal containerRef={menuAnchorRef || defaultMenuAnchorRef}>
            <MenuList
              mt={menuGutter === undefined ? 2 : menuGutter}
              isDisabled={isDisabled}
              {...menuListProps}
            >
              {searchResult.map((option) => (
                <MenuItem
                  key={String(option.value)}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(option.value);
                    focusInput();
                  }}
                  onBlur={(e) => focusInput()}
                  isDisabled={isDisabled}
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
    </FormControl>
  </ClickAwayListener>;
}

export default Autocomplete;
