import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  pagenumber?: string;
}

export function Layout({ children, pagenumber }: LayoutProps) {
  return (
    <div className="pl-8 pt-4 pb-4 print:p-0 relative">
      <div className="page bg-white w-a4w h-a4h relative">
        {children}
        <div className="absolute bottom-8 text-xs text-center w-a4w">
          {pagenumber || ""}
        </div>
      </div>
    </div>
  );
}
