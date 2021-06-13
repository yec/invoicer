import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppState } from "../../App";
import { useInvoices } from "../../useInvoice";

export function InvoicesList() {
  const [appState, setAppState] = useAppState();
  const navigate = useNavigate();
  const params = useParams();
  const { items, loaded } = useInvoices();
  const active = items.find((invoice) => invoice._id === params.invoiceid);

  React.useEffect(() => {
    if (!active && loaded && params.invoiceid) {
      navigate("/invoicer", { replace: true });
    }
  }, [active, loaded, navigate, params.invoiceid]);

  return (
    <>
      {items.map((invoice) => (
        <Link
          key={invoice._id}
          to={`/invoicer/invoice/${invoice._id}`}
          onClick={() => {
            setAppState({ ...appState, listOpen: false });
          }}
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
