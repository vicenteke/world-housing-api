'use client'
import { FC, MutableRefObject, ReactNode } from "react";
import {
  Tag,
  TagCloseButton,
  TagLabel,
  TagProps,
} from "@chakra-ui/react";


export interface AutocompleteTagProps extends TagProps {
  label: ReactNode | string;
  toggleOption: (value: any) => any;
  value: any;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
}


const AutocompleteTag: FC<AutocompleteTagProps> = ({
  label,
  toggleOption,
  value,
  inputRef,
  ...props
}: AutocompleteTagProps) => {
  /*A tag with close button to be used by the autocomplete component*/
  const {children, ...tagProps} = props;
  return <Tag
    {...tagProps}
  >
    {/* Use custom children if provided */}
    {children}

    {/* Use default tag with close button if no children provided */}
    {!children && <>
      {typeof label === 'string' ? <TagLabel>{label}</TagLabel> : {label}}
      <TagCloseButton onClick={() => {
        toggleOption(value);
        if (inputRef && inputRef.current)
          inputRef.current.focus();
      }} />
    </>}
  </Tag>
}

export default AutocompleteTag;
