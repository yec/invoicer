import React from "react";
import { Link, useParams } from "react-router-dom";
import { useInvoices } from "../../useInvoice";

export function InvoicesList() {
  const invoices = useInvoices();
  const params = useParams();

  return (
    <>
      {invoices.items.map((invoice) => (
        <Link
          key={invoice._id}
          to={`/invoicer/invoice/${invoice._id}`}
          className={`${
            invoice._id === params.invoiceid && "bg-gray-200"
          } block p-2 pl-4 pt-4 pb-4 rounded-md focus:bg-yellow-200`}
        >
          <div className="font-semibold ">{invoice.invoiceNumber}</div>
          <div>{invoice.client.name}</div>
        </Link>
      ))}
    </>
  );
}
