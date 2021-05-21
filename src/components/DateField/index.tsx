import React from "react";

export function DateField({
  value,
  onChange,
}: {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <div className="w-28 pointer-events-none">{value}</div>
      <input
        className="datepicker-input ml-auto opacity-10 w-28 absolute right-0"
        defaultValue={value}
        name="dueDate"
        type="date"
        onChange={(e) => {
          onChange && onChange(e);
        }}
      />
    </>
  );
}
