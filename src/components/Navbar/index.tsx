import clsx from "clsx";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 } from "uuid";
import { useAppState } from "../../App";
import { useInvoice } from "../../useInvoice";
import { InvoiceService } from "../../services/InvoiceService";
import {
  IconX,
  IconMenu,
  IconTrash,
  IconLockOpen,
  IconLock,
  IconCopy,
  IconFilePlus,
} from "@tabler/icons";
import { signInGoogle, signOut, useAuth } from "../../hooks/useAuth";
import { dbName } from "../../dbName";

export function MenuButton() {
  const [appState, setAppState] = useAppState();
  return (
    <button
      onClick={() => setAppState({ ...appState, listOpen: !appState.listOpen })}
      className="lg:hidden h-14 w-14 flex items-center justify-center border-r border-gray-200 focus:outline-none"
    >
      {appState.listOpen ? (
        <IconX className="h-8" />
      ) : (
        <IconMenu className="h-8" />
      )}
    </button>
  );
}

export function Navbar() {
  const navigate = useNavigate();
  const { invoiceid } = useParams();
  const invoice = useInvoice(invoiceid);
  const { user, loaded } = useAuth();

  const invoiceService = React.useMemo(() => {
    return !loaded
      ? undefined
      : new InvoiceService(user ? dbName(user.uid) : "invoices");
  }, [user, loaded]);

  return (
    <div className="print:hidden sticky top-0 z-50 lg:z-50 w-full max-w-8xl mx-auto bg-white flex-none flex border-b border-gray-200">
      <MenuButton />
      <div className="h-14 flex items-center pl-8 ">
        {/* <img className="h-8" src="/logo.svg" alt="invoicer logo" />
        <div className="pl-3 flex h-full items-center justify-center semi">
          invoicer
        </div> */}

        <button
          onClick={() => {
            navigate(`/invoicer/invoice/${v4()}`);
          }}
          className="rounded-md hover:bg-gray-200 transition duration-200 h-12 w-12 flex items-center justify-center"
        >
          <IconFilePlus className="h-8" />
        </button>
        <button
          onClick={() => invoiceid && invoiceService?.copy(invoiceid)}
          className="ml-4 rounded-md hover:bg-gray-200 transition duration-200 h-12 w-12 flex items-center justify-center"
        >
          <IconCopy className="h-8" />
        </button>
        <button
          disabled={invoice && invoice.status === "locked"}
          onClick={() => invoiceid && invoiceService?.delete(invoiceid)}
          className={`${clsx({
            "text-gray-400": invoice && invoice.status === "locked",
          })} ml-4 rounded-md hover:bg-gray-200 transition duration-200 h-12 w-12 flex items-center justify-center`}
        >
          <IconTrash className="h-8" />
        </button>
        <button
          onClick={() => invoiceid && invoiceService?.toggleLock(invoiceid)}
          className="ml-4 rounded-md hover:bg-gray-200 transition duration-200 h-12 w-12 flex items-center justify-center"
        >
          {invoice && invoice.status === "locked" ? (
            <IconLock className="h-8" />
          ) : (
            <IconLockOpen className="h-8" />
          )}
        </button>
      </div>
      <div className="ml-auto h-14 flex items-center pr-8">
        {loaded &&
          (user ? (
            <details>
              <summary>
                <img
                  className="rounded-full h-8 w-8"
                  src={user.photoURL || ""}
                  alt="avatar"
                />
                {/* <div className="select-none cursor-pointer rounded-full h-8 w-8 border flex items-center content-center">
                  <div className="ml-auto mr-auto">
                    {shortName(
                      authContext.user.displayName || authContext.user.email
                    )}
                  </div>
                </div> */}
              </summary>

              <div className="fixed right-0 mr-4 bg-white rounded-md shadow-md p-4 text-sm">
                <button onClick={() => signOut()}>Sign out</button>
              </div>
            </details>
          ) : (
            <button className="px-1 text-sm" onClick={() => signInGoogle()}>
              Sign in
            </button>
          ))}
      </div>
    </div>
  );
}
