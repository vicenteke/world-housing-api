'use client'
import React, { FC, useRef } from "react";
import ClickAwayListener from 'react-click-away-listener';

import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormErrorMessageProps,
  FormHelperText,
  FormHelperTextProps,
  FormLabel,
  FormLabelProps,
  Input,
  InputGroup,
  InputGroupProps,
  InputProps,
  InputRightElement,
  Menu,
  MenuItem,
  MenuItemProps,
  MenuList,
  MenuListProps,
  MenuProps,
  Portal,
  Stack,
  StackProps,
  TagProps
} from "@chakra-ui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@chakra-ui/icons";

import useAutocomplete, {
  AutocompleteHookProps,
  AutocompleteHookPropsList,
  AutocompleteOptionProps
} from "../hooks/useAutocomplete";
import AutocompleteTag from "./AutocompleteTag";


export interface AutocompleteMenuItemProps extends MenuItemProps {
  // props passed to each menu item.
  itemKey: string | number;
  onBlurHandler: () => void;
  onClickHandler: () => void;
  option: AutocompleteOptionProps;
  icon?: React.ReactElement;
  isDisabled?: boolean;
}


export interface AutocompleteOnlyProps extends AutocompleteHookProps {
  /* autocomplete-specific options (i.e. not including Chakra's
   * FormControlProps). See below for more information.
   */
  closeMenuIcon?: React.ReactElement;
  error?: string | React.ReactElement;
  errorProps?: FormErrorMessageProps;
  help?: string | React.ReactElement;
  helpProps?: FormHelperTextProps;
  hideRightIcon?: boolean;
  inputGroupProps?: InputGroupProps;
  inputProps?: InputProps;
  isDisabled?: boolean;
  label?: string | React.ReactElement;
  labelProps?: FormLabelProps;
  menuAnchorRef?: React.MutableRefObject<any>;
  menuGutter?: number;
  menuItemProps?: MenuItemProps;
  menuListProps?: MenuListProps;
  menuProps?: MenuProps;
  menuSelectedIcon?: React.ReactElement;
  openMenuIcon?: React.ReactElement;
  renderMenuItem?: (props: AutocompleteMenuItemProps) => React.ReactElement;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tagProps?: TagProps;
  tagStackProps?: StackProps;
}

/* autocomplete is wrapped in a Chakra's FormControl, so it accepts all
 * FormControlProps appart from its own props (AutocompleteOnlyProps).
 */
export type AutocompleteProps = AutocompleteOnlyProps & FormControlProps;

/* Autocomplete component based on Chakra UI.
 *
 * Params (apart from all FormControlProps):
 * - options: array of the available options, each containing a label
 *      (displayed for the user) and a value (identifies the option);
 * - findOptions?: method that takes the search input and returns the options
 *      to be displayed. By default it will look for labels or values that
 *      include the search input;
 * - isCaseInsensitive?: boolean that makes the default search
 *      case-insensitive. Note that, if you specify the findOptions property,
 *      you have to handle that on your own, as it affects only the default
 *      search;
 * - isSingleSelect?: boolean that tells the autocomplete to select only a
 *      single option at most. Therefore, the "value" becomes a single value
 *      and not an array of values (as default);
 * - closeMenuIcon?: specifies a custom ReactElement to be shown on the right
 *      of the text input when the menu list is open. Defaults to a Chakra's
 *      ChevronUpIcon;
 * - error?: error message displayed when the component is invalid. Can be
 *      either a string or a custom ReactElement;
 * - errorProps?: props to be passed to the default error message, which is
 *      actually a Chakra's FormErrorMessage;
 * - help?: helper text displayd under the input. Can be either a string or a
 *      custom ReactElement;
 * - helpProps?: props to be passed to the default helper text, which is
 *      actually a Chakra's FormHelperText;
 * - hideRightIcon?: do not render any icon on the right of the text input;
 * - inputGroupProps?: props to customize the input group. It's in fact a
 *      Chakra's InputGroup;
 * - inputProps?: props to customize the text input. It's in fact a Chakra's
 *      Input;
 * - isDisabled?: whether the input is disabled or not;
 * - label?: form group label. It can be either a string or a ReactElement;
 * - labelProps?: props to customize the input group label. It's in fact a
 *      Chakra's FormLabel;
 * - menuAnchorRef?: reference to the component to position the menu. There is
 *      a default anchor under the input;
 * - menuGutter?: space between the input and the menu list. It is actually a
 *      marginTop in the menu list;
 * - menuItemProps?: props to customize the default menu item. It's in fact a
 *      Chakra's MenuItem. Note that those props are passed to renderMenuItem;
 * - menuListProps?: props to customize the menu list. It's in fact a Chakra's
 *      MenuList;
 * - menuProps?: props to customize the menu list. It's in fact a Chakra's
 *      Menu;
 * - menuSelectedIcon?: specifies a custom ReactElement to be shown on the
 *      left of each selected option in the menu list. Defaults to a green
 *      Chakra's CheckIcon;
 * - openMenuIcon?: specifies a custom ReactElement to be shown on the right of
 *      the text input when the menu list is collapsed. Defaults to a Chakra's
 *      ChevronDownIcon;
 * - renderMenuItem?: specifies a custom method to render each item in the menu
 *      list, taking AutocompleteMenuItemProps as parameters and returnind a
 *      ReactElement;
 * - size?: input group size;
 * - tagProps?: props to customize the selected options tags. It's in fact a
 *      Chakra's Tag;
 * - tagStackProps?: props to customize the selected options list. It's in fact
 *      a Chakra's Stack;
 */
const Autocomplete: FC<AutocompleteProps> = ({
  closeMenuIcon,
  error,
  errorProps,
  help,
  helpProps,
  hideRightIcon,
  inputGroupProps,
  inputProps,
  isDisabled,
  label,
  labelProps,
  menuSelectedIcon,
  menuAnchorRef,
  menuGutter,
  menuItemProps,
  menuListProps,
  menuProps,
  openMenuIcon,
  renderMenuItem,
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
  const formControlPropsEntries: [string, any][] = (
    Object.entries(props).filter(
      (entry) => !AutocompleteHookPropsList.includes(entry[0])
    )
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
    unselectOption,
    searchResult,
    search,
    clearSearch,
  } = useAutocomplete(hookProps);

  function focusInput() {
    // helper to focus on the text input field
    ((inputRef.current as unknown) as HTMLInputElement).focus();
  }

  return <ClickAwayListener onClickAway={() => {
    // collapse menu and clear search when clicking outside the autocomplete
    setOptionsExpanded(false);
    clearSearch();
  }}>
    <FormControl isDisabled={isDisabled} {...formControlProps}>
      {label && // use custom label if specified
        (typeof label === 'string' ?
          <FormLabel {...labelProps}>{label}</FormLabel>
          : label
        )
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
              onClose={isDisabled ? () => {return} : () => unselectOption(val)}
              label={option?.label || val}
              inputRef={inputRef}
              {...tagProps}
            />
          })
          : (value && <AutocompleteTag
            onClose={isDisabled ? () => {return} : () => unselectOption(value)}
            label={
              props.options?.find((item) => item.value === value)?.label
              || value
            }
            inputRef={inputRef}
            {...tagProps}
          />)
        }
      </Stack>
      <InputGroup isDisabled={isDisabled} size={size} {...inputGroupProps}>
        <Input
          ref={inputRef}
          value={searchString}
          onChange={(e) => {
            if (searchString !== e.target.value) {
              setSearchString(e.target.value);
              setOptionsExpanded(true);
              search(e.target.value);
    
              /* enforce focus. For some reason it blurs when shortening the
               * search string matches new options.
               */
              setTimeout(
                () => focusInput(),
                100
              );
            }
          }}
          onClick={() => setOptionsExpanded(!optionsExpanded)}
          isDisabled={isDisabled}
          {...inputProps}
        />
        {!hideRightIcon &&
          <InputRightElement
            onClick={() => setOptionsExpanded(!optionsExpanded)}
          >
            {optionsExpanded ?
              (closeMenuIcon || <ChevronUpIcon />)
              : (openMenuIcon || <ChevronDownIcon />)
            }
          </InputRightElement>
        }
      </InputGroup>

      {!menuAnchorRef && // default menu anchor
        <InputGroup
          ref={defaultMenuAnchorRef}
          zIndex='dropdown'
          position='relative'
        />
      }

      {help &&
        (typeof help === 'string' ?
          <FormHelperText isDisabled={isDisabled} {...helpProps}>
            {help}
          </FormHelperText>
          : help
        )
      }

      {error &&
        (typeof error === 'string' ?
          <FormErrorMessage isDisabled={isDisabled} {...errorProps}>
            {error}
          </FormErrorMessage>
          : error
        )
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
              {searchResult.map((option, index) => {
                /* specify AutocompleteMenuItemProps. Some values were reserved
                 * words, so they are passed separatedly.
                 */
                const onClickHandler = () => {
                  toggleOption(option.value);
                  focusInput();
                };
                const onBlurHandler = () => focusInput();
                const itemKey = String(option.value) || index;

                const itemProps: any = {
                  isDisabled: isDisabled,
                  icon: (
                    (props.isSingleSelect && option.value === value)
                    || (
                      !props.isSingleSelect &&
                      value.find((val: any) => val === option.value)
                    )
                  ) ?
                    (menuSelectedIcon || <CheckIcon color='green' />)
                    : undefined,
                  ...menuItemProps
                };

                // use custom method if specified
                if (renderMenuItem)
                  return renderMenuItem({
                    itemKey,
                    onBlurHandler,
                    onClickHandler,
                    option,
                    ...itemProps
                  });

                // default menu item
                return <MenuItem
                  key={itemKey}
                  onClick={onClickHandler}
                  onBlur={onBlurHandler}
                  {...itemProps}
                >
                  {option.label}
                </MenuItem>
              })}
            </MenuList>
        </Portal>
      </Menu>
    </FormControl>
  </ClickAwayListener>;
}

export default Autocomplete;
