import React from "react";
import { Link, useParams } from "react-router-dom";
import { InvoiceService } from "../../services/InvoiceService";
import { Client, InvoiceState } from "../../state";

export function InvoicesList() {
  const [invoices, setInvoices] = React.useState<InvoiceState[]>();
  const params = useParams();

  React.useEffect(() => {
    async function getInvoices() {
      const all = await InvoiceService.getAll();
      console.log("all", all);
      setInvoices(all);
    }

    InvoiceService.changes((value) => {
      getInvoices();
    });

    getInvoices();
  }, []);

  return (
    <>
      {invoices?.map((invoice) => (
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
