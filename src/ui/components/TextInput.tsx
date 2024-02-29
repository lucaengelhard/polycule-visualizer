import { forwardRef } from "react";

const TextInput = forwardRef(function TextInput(
  {
    defaultValue,
    value,
    placeholder,
    onChange,
    onInput,
    onBlur,
    additionalClasses,
  }: {
    defaultValue?: string;
    value?: string;
    placeholder?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    additionalClasses?: string;
  },
  ref?: React.ForwardedRef<HTMLInputElement>,
) {
  return (
    <input
      className={
        "pointer-events-auto h-min w-min rounded-lg p-3 shadow-lg " +
        additionalClasses
      }
      type="text"
      defaultValue={defaultValue}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onInput={onInput}
      onBlur={onBlur}
      ref={ref}
    ></input>
  );
});

export default TextInput;
