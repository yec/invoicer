import React from "react";

export type Size = "small";

export function Button({
  size,
  children,
  className,
  ...rest
}: { size?: Size } & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  const sizeClasses =
    size === "small"
      ? "px-4 py-1 text-sm rounded-sm rounded-full"
      : "px-8 py-3 text-base rounded-md";

  return (
    <button
      {...rest}
      className={`${className} ${sizeClasses} font-medium flex items-center justify-center border border-transparent text-white`}
    >
      {children}
    </button>
  );
}
