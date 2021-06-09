import React, { Dispatch, SetStateAction, useContext } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { InvoicesList } from "./views/InvoicesList";
import { Empty } from "./views/Empty";
import { Invoice } from "./views/Invoice";
import { AuthProvider } from "./hooks/useAuth";
import { SyncDB } from "./SyncDB";

export type AppState = {
  invoiceId?: string;
};

export const AppContext =
  React.createContext<[AppState, Dispatch<SetStateAction<AppState>>] | null>(
    null
  );

export function AppProvider({ children }: { children: React.ReactNode }) {
  const value = React.useState<AppState>({});
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("app provider not set");
  }
  return context;
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <SyncDB />
          <div className="">
            <Routes basename={"/invoicer"}>
              <Route
                path="/invoice/:invoiceid"
                element={
                  <>
                    <Navbar />
                    <div className="flex print:block">
                      <div className="print:hidden fixed z-40 inset-0 flex-none h-full bg-black bg-opacity-25 w-full lg:bg-white lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-60 xl:w-72 lg:block hidden">
                        <div className="h-full overflow-y-auto scrolling-touch lg:h-auto lg:block lg:relative lg:sticky lg:bg-transparent lg:top-14 bg-white mr-24 lg:mr-0">
                          <div className="hidden lg:block h-12 pointer-events-none absolute inset-x-0 z-10 bg-gradient-to-b from-white"></div>
                          <div className="px-1 pt-6 sm:px-3 xl:px-5 sticky?lg:h-(screen-18)">
                            <InvoicesList />
                          </div>
                        </div>
                      </div>
                      <div className="w-full">
                        <Invoice />
                      </div>
                    </div>
                  </>
                }
              />
              <Route element={<Empty />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
