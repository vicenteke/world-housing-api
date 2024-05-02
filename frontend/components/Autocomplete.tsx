'use client'
import { FC, useRef } from "react";
import {
  Badge,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuList,
  MenuItem,
  Portal,
  Stack,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from "@chakra-ui/icons";
import useAutocomplete, { IAutocompleteHook } from "../hooks/useAutocomplete";

export interface IAutocomplete extends IAutocompleteHook {
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  error?: string; // TODO
}


const Autocomplete: FC<IAutocomplete> = ({
  disabled,
  size,
  ...hookProps
}: IAutocomplete) => {
  const ref = useRef(null);
  const {
    value,
    setValue,
    clearSearch,
    searchString,
    setSearchString,
    optionsExpanded,
    setOptionsExpanded,
    toggleOption,
    searchResult,
    search,
  } = useAutocomplete(hookProps);

  return <>
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
          return <Badge
            key={val}
            onClick={() => toggleOption(val)}
            style={{ cursor: 'pointer' }}
          >
            {option?.label || val}
          </Badge>
        })
        : <Badge onClick={() => toggleOption(value)}>{value}</Badge>}
    </Stack>
    <InputGroup>
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
      />
      <InputRightElement onClick={() => setOptionsExpanded(!optionsExpanded)}>
        {optionsExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </InputRightElement>
    </InputGroup>
    <InputGroup ref={ref} style={{ width: '100%', marginTop: optionsExpanded ? 8 : 0 }} />
    <Menu isOpen={optionsExpanded} closeOnSelect={hookProps.isSingleSelect}>
      <Portal containerRef={ref}>
          <MenuList>
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
                  ? <CheckIcon color='green' /> : undefined
                }
              >
                {option.label}
              </MenuItem>
            ))}
          </MenuList>
      </Portal>
    </Menu>
  </>;
}

export default Autocomplete;
