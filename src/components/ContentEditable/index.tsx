import clsx from "clsx";
import React from "react";

export function ContentEditable({
  children,
  onBlur,
  className,
  edit = true,
  ...rest
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { edit?: boolean }) {
  const divRef = React.useRef<HTMLDivElement>(null);
  const text = children?.toString() || " ";

  React.useEffect(() => {
    if (divRef.current) {
      divRef.current.innerText = text;
      divRef.current.contentEditable = edit ? "true" : "false";
    }
  }, [text, edit]);

  return (
    <div
      spellCheck={false}
      className={`${className} ${clsx({
        "bg-pink-100": edit,
      })}  print:bg-transparent`}
      {...rest}
      onBlur={onBlur}
      ref={divRef}
      contentEditable="true"
    ></div>
  );
}
