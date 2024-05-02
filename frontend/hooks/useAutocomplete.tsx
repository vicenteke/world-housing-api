'use client'
import { useState } from "react";


interface AutocompleteOptionProps {
  label: string;
  value: any;
}

interface AutocompleteHookProps {
  options: AutocompleteOptionProps[];
  isSingleSelect?: boolean;
  findOptions?: (search: string) => AutocompleteOptionProps[];
  isCaseInsensitive?: boolean;
}

// We rather keep a list here in order to keep related data in the same file
export const AutocompleteHookPropsList = [
  'options',
  'isSingleSelect',
  'findOptions',
  'isCaseInsensitive',
]


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
    const searchTerm = _searchString === undefined ? searchString : _searchString;
    if (findOptions) {
      let res = findOptions(searchTerm);
      setSearchResult(res);
      return res;
    }

    if (!searchTerm) {
      setSearchResult(options);
      return options;
    }

    let res = [];
    const searchValue = (
      isCaseInsensitive ? searchTerm.toLowerCase() : searchTerm
    );
    for (const option of options) {
      let optionLabel = option.label;
      let optionValue = String(option.value);
      if (isCaseInsensitive) {
        optionLabel = optionLabel.toLowerCase();
        optionValue = optionValue.toLowerCase();
      }

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
        (option) => option.value === optionValue || value.includes(option.value)
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
    value,
    setValue,
    searchString,
    setSearchString,
    clearSearch,
    optionsExpanded,
    setOptionsExpanded,
    reset,
    search,
    selectOption,
    unselectOption,
    toggleOption,
    searchResult,
    setSearchResult,
  }
};

export default useAutocomplete;
export type { AutocompleteHookProps, AutocompleteOptionProps }
