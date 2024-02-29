export default function ColorInput({
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
}) {
  return (
    <input
      type="color"
      className={
        "aspect-square h-10 w-10 rounded-lg border-none " + additionalClasses
      }
      onChange={onChange}
      onInput={onInput}
      onBlur={onBlur}
      value={value}
      defaultValue={defaultValue}
    />
  );
}
