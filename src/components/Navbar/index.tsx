import clsx from "clsx";
import React from "react";
import { useNavigate, useParams, useRoutes } from "react-router-dom";
import { v4 } from "uuid";
import { useAppState } from "../../App";
import { useInvoice } from "../../useInvoice";
import { InvoiceService } from "../../services/InvoiceService";
import { ReactComponent as Trash } from "../../trash.svg";
import {
  IconTrash,
  IconLockOpen,
  IconLock,
  IconCopy,
  IconFilePlus,
} from "@tabler/icons";

export function Navbar() {
  const navigate = useNavigate();
  const { invoiceid } = useParams();
  const invoice = useInvoice(invoiceid);

  return (
    <div className="print:hidden sticky top-0 z-40 lg:z-50 w-full max-w-8xl mx-auto bg-white flex-none flex">
      <div className="h-14 flex items-center pl-8 ">
        {/* <img className="h-8" src="/logo.svg" alt="invoicer logo" />
        <div className="pl-3 flex h-full items-center justify-center semi">
          invoicer
        </div> */}

        <button
          onClick={() => {
            navigate(`/invoice/${v4()}`);
          }}
          className="rounded-md hover:bg-gray-200 transition duration-200 h-12 w-12 flex items-center justify-center"
        >
          <IconFilePlus className="h-8" />
        </button>
        <button
          onClick={() => invoiceid && InvoiceService.copy(invoiceid)}
          className="ml-4 rounded-md hover:bg-gray-200 transition duration-200 h-12 w-12 flex items-center justify-center"
        >
          <IconCopy className="h-8" />
        </button>
        <button
          disabled={invoice && invoice.status === "locked"}
          onClick={() => invoiceid && InvoiceService.delete(invoiceid)}
          className={`${clsx({
            "text-gray-400": invoice && invoice.status === "locked",
          })} ml-4 rounded-md hover:bg-gray-200 transition duration-200 h-12 w-12 flex items-center justify-center`}
        >
          <IconTrash className="h-8" />
        </button>
        <button
          onClick={() => invoiceid && InvoiceService.toggleLock(invoiceid)}
          className="ml-4 rounded-md hover:bg-gray-200 transition duration-200 h-12 w-12 flex items-center justify-center"
        >
          {invoice && invoice.status === "locked" ? (
            <IconLock className="h-8" />
          ) : (
            <IconLockOpen className="h-8" />
          )}
        </button>
      </div>
    </div>
  );
}
