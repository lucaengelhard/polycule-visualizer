import { forwardRef } from "react";

const ColorInput = forwardRef(function ColorInput(
  {
    value,
    defaultValue,
    onChange,
    onInput,
    onBlur,
    additionalClasses,
  }: {
    value?: string;
    defaultValue?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    additionalClasses?: string;
  },
  ref?: React.ForwardedRef<HTMLInputElement>,
) {
  return (
    <input
      ref={ref}
      type="color"
      className={
        "pointer-events-auto aspect-square h-10 w-10 rounded-lg border-none " +
        additionalClasses
      }
      onChange={onChange}
      onInput={onInput}
      onBlur={onBlur}
      value={value}
      defaultValue={defaultValue}
    />
  );
});

export default ColorInput;
