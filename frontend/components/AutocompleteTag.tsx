'use client'
import { FC, ReactNode, useRef } from "react";
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
  const {children, ...tagProps} = props;
  return <Tag
    {...tagProps}
  >
    {children}
    {!children && <>
      {typeof label === 'string' ? <TagLabel>{label}</TagLabel> : {label}}
      <TagCloseButton onClick={() => toggleOption(value)} />
    </>}
  </Tag>
}

export default AutocompleteTag;
