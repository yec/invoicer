import React from "react";

interface TextFieldProps {
  label: string;
  name: string;
  defaultValue?: string | number;
}

export function TextField({ name, label, defaultValue }: TextFieldProps) {
  return (
    <div className="relative z-0 mb-5">
      <input
        defaultValue={defaultValue}
        type="text"
        name={name}
        placeholder=" "
        required
        className="pt-3 pb-2 block px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
      />
      <label
        htmlFor={name}
        className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
      >
        {label}
      </label>
      <span className="text-sm text-red-600 hidden" id="error">
        Name is required
      </span>
    </div>
  );
}
