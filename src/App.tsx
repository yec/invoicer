import React, { Dispatch, SetStateAction, useContext } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { InvoicesList } from "./views/InvoicesList";
import { Empty } from "./views/Empty";
import { Invoice } from "./views/Invoice";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { SyncDB } from "./SyncDB";
import clsx from "clsx";

export type AppState = {
  invoiceId?: string;
  listOpen?: boolean;
};

export const AppContext =
  React.createContext<[AppState, Dispatch<SetStateAction<AppState>>] | null>(
    null
  );

export function AppProvider({ children }: { children: React.ReactNode }) {
  const value = React.useState<AppState>({});
  const authContext = useAuth();
  return (
    <AppContext.Provider value={value}>
      {authContext.user && <SyncDB />}
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("app provider not set");
  }
  return context;
}

export function Tray() {
  const [appState] = useAppState();

  return (
    <div
      className={clsx(
        "print:hidden",
        "fixed z-40 flex-none border-r border-gray-200",
        "lg:bg-white lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-60 xl:w-72 lg:block",
        {
          "inset-0 bg-white static h-auto overflow-y-visible w-full md:w-60 pt-0 block":
            appState.listOpen,
          "inset-0 hidden w-full h-full": !appState.listOpen,
        }
      )}
    >
      <div
        className={clsx(
          "overflow-y-auto scrolling-touch bg-white",
          "lg:h-auto lg:block lg:relative lg:sticky lg:bg-transparent lg:top-14 lg:mr-0",
          {
            "h-auto block relative bg-transparent top-14 mr-0":
              appState.listOpen,
            "h-full mr-24": !appState.listOpen,
          }
        )}
      >
        <div className="hidden lg:block h-12 pointer-events-none absolute inset-x-0 z-10 bg-gradient-to-b from-white"></div>
        <div className="px-1 pt-6 sm:px-3 xl:px-5 sticky?lg:h-(screen-18)">
          <InvoicesList />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <div className="">
            <Routes basename={"/invoicer"}>
              <Route
                path="/invoice/:invoiceid"
                element={
                  <>
                    <Navbar />
                    <div className="flex print:block">
                      <Tray />
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
