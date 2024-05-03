'use client'
import { useState } from "react";


interface AutocompleteOptionProps {
  // interface for each autocomplete option.
  label: string;    // value displayed for the user
  value: any;       // option identifier (hidden from the user)
}

interface AutocompleteHookProps {
  // hook parameters. See description below for more information.
  options: AutocompleteOptionProps[];
  findOptions?: (search: string) => AutocompleteOptionProps[];
  isCaseInsensitive?: boolean;
  isSingleSelect?: boolean;
}

// we rather keep a list here in order to keep related data in the same file.
// used to differentiate hook parameters from other props.
export const AutocompleteHookPropsList = [
  'options',
  'isSingleSelect',
  'findOptions',
  'isCaseInsensitive',
]

/* A hook implementing the autocomplete logic.
 *
 * Params:
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
 *
 * Returns:
 * - value (setter: setValue): array of the selected options' values or the
 *      selected option's value (if isSingleSelect);
 * - searchString (setter: setSearchString): string in the text input;
 * - clearSearch: sets search string to '' and resets the search result;
 * - optionsExpanded (setter: setOptionsExpanded): controls menu's
 *      open/collapsed state.
 * - reset: resets autocomplete state (searchString, searchResults and value);
 * - search: performs a search in the options based on the search string. It
 *      accepts a search string as a parameter, but defaults to the current
 *      searchString state. By default it will look for labels or values that
 *      include the search input, but this behaviour can be changed by
 *      specifying a custom method as the findOptions prop;
 * - selectOption/unselectOption/toggleOption: selects/unselects/toggle
 *      selection of a single option. That means inserting or removing its
 *      value from the "value" state (if multiselect), or setting/clearing the
 *      "value" (if isSingleSelect);
 * - searchResult (setter: setSearchResult): state that stores all options to
 *      be shown in the menu. It is updated after each search();
 */
const useAutocomplete = ({
  options,
  isSingleSelect,
  findOptions,
  isCaseInsensitive,
}: AutocompleteHookProps) => {
  const [value, setValue] = useState<any>(isSingleSelect ? null : []);
  const [searchString, setSearchString] = useState<string>('');
  const [searchResult, setSearchResult] = useState<AutocompleteOptionProps[]>(options);
  const [optionsExpanded, setOptionsExpanded] = useState<boolean>(false);

  function clearSearch() {
    setSearchString('');
    setSearchResult(options);
  };

  function reset() {
    clearSearch();
    setValue(isSingleSelect ? null : []);
    setSearchResult(options);
  };

  function search(_searchString?: string) {
    const searchTerm = (
      _searchString === undefined ? searchString : _searchString
    );
    if (findOptions) {
      // use custom method if provided
      let res = findOptions(searchTerm);
      setSearchResult(res);
      return res;
    }

    if (!searchTerm) {
      // if no search, all options are in the result
      setSearchResult(options);
      return options;
    }

    let res = [];

    // handle case sensitivity
    const searchValue = (
      isCaseInsensitive ? searchTerm.toLowerCase() : searchTerm
    );

    for (const option of options) {
      let optionLabel = option.label;
      let optionValue = String(option.value);
      if (isCaseInsensitive) {
        // handle case sensitivity
        optionLabel = optionLabel.toLowerCase();
        optionValue = optionValue.toLowerCase();
      }

      // the default method checks for labels or values that include the search
      if (optionLabel.includes(searchValue)
          || optionValue.includes(searchValue))
        res.push(option);
    }

    setSearchResult(res);
    return res;
  };

  function selectOption(optionValue: any) {
    if (!options.map((item) => item.value).includes(optionValue))
      return value;

    let newValue = isSingleSelect ? value : [...value];
    if (isSingleSelect && value !== optionValue)
      newValue = optionValue;
    else if (!isSingleSelect && !value.includes(optionValue))
      newValue = options.filter(
        (option) => (
          option.value === optionValue || value.includes(option.value)
        )
      );

    setValue(newValue);
    return newValue;
  };

  function unselectOption(optionValue: any) {
    if (!options.map((item) => item.value).includes(optionValue))
      return value;

    let newValue = isSingleSelect ? value : [...value];
    if (isSingleSelect && value === optionValue)
      newValue = '';
    else if (!isSingleSelect && value.includes(optionValue))
      newValue = newValue.filter(
        (itemValue: any) => itemValue !== optionValue
      );

    setValue(newValue);
    return newValue;
  }

  function toggleOption(optionValue: any) {
    if (!options.map((item) => item.value).includes(optionValue))
      return value;

    let newValue = isSingleSelect ? value : [...value];
    if (isSingleSelect) {
      if (value === optionValue)
        newValue = '';
      else
        newValue = optionValue;
    }
    else {
      if (value.includes(optionValue))
        newValue = newValue.filter(
          (itemValue: any) => itemValue !== optionValue
        );
      else
      newValue = options.filter(
        (option) => option.value === optionValue || value.includes(option.value)
      ).map((option) => option.value);
    }

    setValue(newValue);
    return newValue;
  }

  return {
    clearSearch,
    optionsExpanded,
    reset,
    search,
    searchResult,
    searchString,
    selectOption,
    setOptionsExpanded,
    setSearchResult,
    setSearchString,
    setValue,
    toggleOption,
    unselectOption,
    value
  }
};

export default useAutocomplete;
export type { AutocompleteHookProps, AutocompleteOptionProps }
