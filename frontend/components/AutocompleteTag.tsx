'use client'
import { FC, MutableRefObject, ReactNode } from "react";
import {
  Tag,
  TagCloseButton,
  TagLabel,
  TagProps
} from "@chakra-ui/react";


export interface AutocompleteTagProps extends TagProps {
  // props for the AutocompleteTag component. See below for more information.
  label: ReactNode | string;
  onClose: () => void;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  isDisabled?: boolean;
}


/* Default autocomplete tag component, used to display selected options.
 *
 * Params:
 * - label: text to be shown in the tag. Note that it is overridden by the
 *      children if any is passed to the component;
 * - onClose: method to be executed when clicking on the close button on the
 *      right. It only applies when no children is passed to the component;
 * - inputRef?: optional reference to the input, so it can focus on it after
 *      closing the tag (default behaviour). It only applies when no children
 *      is passed to the component;
 * - isDisabled?: used to style component and disable onClick;
 */
const AutocompleteTag: FC<AutocompleteTagProps> = ({
  label,
  onClose,
  inputRef,
  isDisabled,
  ...props
}: AutocompleteTagProps) => {
  /*A tag with close button to be used by the autocomplete component*/
  const {children, ...tagProps} = props;
  return <Tag
    opacity={isDisabled ? 0.6 : 1}
    cursor={isDisabled ? 'not-allowed' : 'inherit'}
    {...tagProps}
  >
    {/* Use custom children if provided */}
    {children}

    {/* Use default tag with close button if no children provided */}
    {!children && <>
      {typeof label === 'string' ? <TagLabel>{label}</TagLabel> : {label}}
      <TagCloseButton
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        onClick={() => {
          if (!isDisabled) {
            onClose();
            if (inputRef && inputRef.current)
              // focus on input if possible
              inputRef.current.focus();
          }
        }}
      />
    </>}
  </Tag>
}

export default AutocompleteTag;
