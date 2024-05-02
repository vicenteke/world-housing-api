'use client'
import { useState } from "react";


interface IAutocompleteOption {
  label: string;
  value: any;
}

interface IAutocompleteHook {
  options: IAutocompleteOption[];
  isSingleSelect?: boolean;
  findOptions?: (search: string) => IAutocompleteOption[];
  isCaseInsensitive?: boolean;
}


const useAutocomplete = ({
  options,
  isSingleSelect,
  findOptions,
  isCaseInsensitive,
}: IAutocompleteHook) => {
  const [value, setValue] = useState<any>(isSingleSelect ? null : []);
  const [searchString, setSearchString] = useState<string>('');
  const [searchResult, setsearchResult] = useState<IAutocompleteOption[]>(options);
  const [optionsExpanded, setOptionsExpanded] = useState<boolean>(false);

  function clearSearch() {
    setSearchString('');
    setsearchResult(options);
  };

  function reset() {
    clearSearch();
    setValue(isSingleSelect ? null : []);
    setsearchResult(options);
  };

  function search(_searchString?: string) {
    const searchTerm = _searchString === undefined ? searchString : _searchString;
    if (findOptions) {
      let res = findOptions(searchTerm);
      setsearchResult(res);
      return res;
    }

    if (!searchTerm) {
      setsearchResult(options);
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
    setsearchResult(res);
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
    setsearchResult,
  }
};

export default useAutocomplete;
export type { IAutocompleteHook, IAutocompleteOption }
