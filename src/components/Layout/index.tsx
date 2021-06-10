import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  pagenumber?: string;
}

export function Layout({ children, pagenumber }: LayoutProps) {
  return (
    <div className="md:pl-8 pt-4 pb-4 print:p-0 relative">
      <div className="page bg-white w-full md:w-a4w md:h-a4h print:w-a4w print:h-a4h relative">
        {children}
        <div className="absolute bottom-8 text-xs text-center w-full md:w-a4w print:w-a4w">
          {pagenumber || ""}
        </div>
      </div>
    </div>
  );
}
