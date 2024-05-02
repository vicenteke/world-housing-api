'use client'
import { FC, ReactNode } from "react";
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
}


const AutocompleteTag: FC<AutocompleteTagProps> = ({
  label,
  toggleOption,
  value,
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
      <TagCloseButton onClick={() => toggleOption(value)} />
    </>}
  </Tag>
}

export default AutocompleteTag;
