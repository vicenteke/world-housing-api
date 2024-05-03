# Chakra UI Autocomplete
An autocomplete component based on Chakra UI elements.

:white_check_mark: consistent with Chakra UI design;
:white_check_mark: highly customizable;
:white_check_mark: easy and ready to use;
:white_check_mark: simple implementation, so you can taylor it for specific needs.

[insert example image(s)]

## Usage
[insert examples]

## Components
### Autocomplete
Autocomplete component based on Chakra UI.

#### Props (apart from Chakra's FormControlProps)
| Name              | Type                                                     | Required | Description                                                                                                                                                                            | Default                                                                    |
|-------------------|----------------------------------------------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| value             | any                                                      | true     | state holding array of the selected options' values or the selected option's value (if isSingleSelect)                                                                                 |                                                                            |
| setValue          | React.Dispatch\<any>                                     | true     | "value" state setter                                                                                                                                                                   |                                                                            |
| options           | AutocompleteOptionProps[]                                | true     | array of the available options, each containing a label (displayed for the user) and a value (identifies the option)                                                                   |                                                                            |
| findOptions       | (search: string) => AutocompleteOptionProps[]            | false    | method that takes the search input and returns the options to be displayed                                                                                                             | By default it will look for labels or values that include the search input |
| isCaseInsensitive | boolean                                                  | false    | boolean that makes the default search case-insensitive. Note that, if you specify the findOptions property, you have to handle that on your own, as it affects only the default search | false                                                                      |
| isSingleSelect    | boolean                                                  | false    | boolean that tells the autocomplete to select only a single option at most. Therefore, the "value" becomes a single value and not an array of values (as default)                      | false                                                                      |
| closeMenuIcon     | React.ReactElement                                       | false    | specifies a custom ReactElement to be shown on the right of the text input when the menu list is open. Defaults to a Chakra's ChevronUpIcon                                            | \<ChevronUpIcon />                                                         |
| error             | string \| React.ReactElement                             | false    | error message displayed when the component is invalid. Can be either a string or a custom ReactElement                                                                                 | undefined                                                                  |
| errorProps        | FormErrorMessageProps                                    | false    | props to be passed to the default error message, which is actually a Chakra's FormErrorMessage                                                                                         | {}                                                                         |
| help              | string \| React.ReactElement                             | false    | helper text displayd under the input. Can be either a string or a custom ReactElement                                                                                                  | undefined                                                                  |
| helpProps         | FormHelperTextProps                                      | false    | props to be passed to the default helper text, which is actually a Chakra's FormHelperText                                                                                             | {}                                                                         |
| hideRightIcon     | boolean                                                  | false    | do not render any icon on the right of the text input                                                                                                                                  | false                                                                      |
| inputGroupProps   | InputGroupProps                                          | false    | props to customize the input group. It's in fact a Chakra's InputGroup                                                                                                                 | {}                                                                         |
| inputProps        | InputProps                                               | false    | props to customize the text input. It's in fact a Chakra's Input                                                                                                                       | {}                                                                         |
| isDisabled        | boolean                                                  | false    | whether the input is disabled or not                                                                                                                                                   | false                                                                      |
| label             | string \| React.ReactElement                             | false    | form group label. It can be either a string or a ReactElement                                                                                                                          | undefined                                                                  |
| labelProps        | FormLabelProps                                           | false    | props to customize the input group label. It's in fact a Chakra's FormLabel                                                                                                            | {}                                                                         |
| menuAnchorRef     | React.MutableRefObject                                   | false    | reference to the component to position the menu. There is a default anchor under the input                                                                                             | default anchor under the input                                             |
| menuGutter        | number                                                   | false    | space between the input and the menu list. It is actually a marginTop in the menu list                                                                                                 | 2                                                                          |
| menuItemProps     | MenuItemProps                                            | false    | props to customize the default menu item. It's in fact a Chakra's MenuItem. Note that those props are passed to renderMenuItem                                                         | {}                                                                         |
| menuListProps     | MenuListProps                                            | false    | props to customize the menu list. It's in fact a Chakra's MenuList                                                                                                                     | {}                                                                         |
| menuProps         | MenuProps                                                | false    | props to customize the menu list. It's in fact a Chakra's Menu                                                                                                                         | {}                                                                         |
| menuSelectedIcon  | React.ReactElement                                       | false    | specifies a custom ReactElement to be shown on the left of each selected option in the menu list. Defaults to a green Chakra's CheckIcon                                               | \<CheckIcon color='green' />                                               |
| openMenuIcon      | React.ReactElement                                       | false    | specifies a custom ReactElement to be shown on the right of the text input when the menu list is collapsed. Defaults to a Chakra's ChevronDownIcon                                     | \<ChevronDownIcon />                                                       |
| renderMenuItem    | (props: AutocompleteMenuItemProps) => React.ReactElement | false    | specifies a custom method to render each item in the menu list, taking AutocompleteMenuItemProps as parameters and returnind a ReactElement                                            | Chakra's MenuItem                                                          |
| size              | 'xs' \| 'sm' \| 'md' \| 'lg'                             | false    | input group size                                                                                                                                                                       | Chakra's default input size                                                |
| tagProps          | TagProps                                                 | false    | props to customize the selected options tags. It's in fact a Chakra's Tag                                                                                                              | {}                                                                         |
| tagStackProps     | StackProps                                               | false    | props to customize the selected options list. It's in fact a Chakra's Stack                                                                                                            | {}                                                                         |

### AutocompleteTag  (apart from Chakra's TagProps)
Default autocomplete tag component, used to display selected options.

#### Props
| Name       | Type                      | Required | Description                                                                                                                                                   | Default   |
|------------|---------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| label      | React.ReactNode \| string | true     | text to be shown in the tag. Note that it is overridden by the children if any is passed to the component                                                     |           |
| onClose    | () => void                | true     | method to be executed when clicking on the close button on the right. It only applies when no children is passed to the component                             |           |
| inputRef   | React.MutableRefObject    | false    | optional reference to the input, so it can focus on it after closing the tag (default behaviour). It only applies when no children is passed to the component | undefined |
| isDisabled | boolean                   | false    | used to style component and disable onClick                                                                                                                   | false     |

## useAutocomplete Hook
A hook implementing the autocomplete logic.

### Example
```typescript
import useAutocomplete from 'chakra-ui-autocomplete';

const HOOK_PROPS = {
  options: [
    {
      label: 'First Option',
      value: 1
    },
    {
      label: 'Second Option',
      value: 2
    }
  ];
  findOptions: (search: string) => (
    options.filter(opt => opt.label.includes(search));
  ),
  isCaseInsensitive: false,
  isSingleSelect: true

function MyComponent() {
  const {
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
  } = useAutocomplete(HOOK_PROPS);

  ...
}
```

### Props
| Name              | Type                                          | Required | Description                                                                                                                                                                            | Default                                                                    |
|-------------------|-----------------------------------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| value             | any                                           | true     | state holding array of the selected options' values or the selected option's value (if isSingleSelect)                                                                                 |                                                                            |
| setValue          | React.Dispatch\<any>                          | true     | "value" state setter                                                                                                                                                                   |                                                                            |
| options           | AutocompleteOptionProps[]                     | true     | array of the available options, each containing a label (displayed for the user) and a value (identifies the option)                                                                   |                                                                            |
| findOptions       | (search: string) => AutocompleteOptionProps[] | false    | method that takes the search input and returns the options to be displayed                                                                                                             | By default it will look for labels or values that include the search input |
| isCaseInsensitive | boolean                                       | false    | boolean that makes the default search case-insensitive. Note that, if you specify the findOptions property, you have to handle that on your own, as it affects only the default search | false                                                                      |
| isSingleSelect    | boolean                                       | false    | boolean that tells the autocomplete to select only a single option at most. Therefore, the "value" becomes a single value and not an array of values (as default)                      | false                                                                      |
