import { ChevronDown } from 'lucide-react'
import {
  Button as RACButton,
  FieldError,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  Text,
  TextArea,
  TextField as RACTextField,
  type SelectProps,
  type TextFieldProps,
} from 'react-aria-components'
import { Icon } from './Icon'

/**
 * Form controls on React Aria Components (C16). Every control carries rest,
 * hover, pressed, focus, disabled, loading, empty and error states through
 * `ds.css`; errors are announced through `FieldError`, never colour alone.
 */

export interface TextFieldProps2 extends TextFieldProps {
  label: string
  description?: string
  placeholder?: string
}

export function TextField({
  label,
  description,
  placeholder,
  className,
  ...rest
}: TextFieldProps2) {
  return (
    <RACTextField
      {...rest}
      className={['ds-field', className].filter(Boolean).join(' ')}
    >
      <Label className="ds-field__label">{label}</Label>
      <Input className="ds-field__input" placeholder={placeholder} />
      {description ? (
        <Text slot="description" className="ds-field__description">
          {description}
        </Text>
      ) : null}
      <FieldError className="ds-field__error" />
    </RACTextField>
  )
}

export interface TextAreaFieldProps extends TextFieldProps {
  label: string
  description?: string
  placeholder?: string
  rows?: number
}

export function TextAreaField({
  label,
  description,
  placeholder,
  rows = 4,
  className,
  ...rest
}: TextAreaFieldProps) {
  return (
    <RACTextField
      {...rest}
      className={['ds-field', className].filter(Boolean).join(' ')}
    >
      <Label className="ds-field__label">{label}</Label>
      <TextArea
        className="ds-field__input ds-field__textarea"
        placeholder={placeholder}
        rows={rows}
      />
      {description ? (
        <Text slot="description" className="ds-field__description">
          {description}
        </Text>
      ) : null}
      <FieldError className="ds-field__error" />
    </RACTextField>
  )
}

export interface SelectOption {
  id: string
  label: string
  description?: string
}

export interface SelectFieldProps
  extends Omit<SelectProps<SelectOption>, 'children'> {
  label: string
  options: SelectOption[]
  placeholder?: string
}

export function SelectField({
  label,
  options,
  placeholder = 'Select an option',
  className,
  ...rest
}: SelectFieldProps) {
  return (
    <Select
      {...rest}
      className={['ds-field', 'ds-field--select', className]
        .filter(Boolean)
        .join(' ')}
    >
      <Label className="ds-field__label">{label}</Label>
      <RACButton className="ds-field__input ds-field__select">
        <SelectValue className="ds-field__value" />
        <span className="ds-field__chevron" aria-hidden="true">
          <Icon icon={ChevronDown} size={18} />
        </span>
      </RACButton>
      <Popover className="ds-popover">
        <ListBox className="ds-listbox" items={options}>
          {(option) => (
            <ListBoxItem
              id={option.id}
              textValue={option.label}
              className="ds-listbox__item"
            >
              {option.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
      <Text slot="description" className="ds-field__description">
        {placeholder}
      </Text>
      <FieldError className="ds-field__error" />
    </Select>
  )
}