import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { useInvoices } from "../../useInvoice";

export function Empty() {
  const navigate = useNavigate();
  const invoices = useInvoices();

  React.useEffect(() => {
    if (invoices.loaded) {
      if (invoices.items.length > 0) {
        navigate(`/invoicer/invoice/${invoices.items[0]._id}`);
      } else {
        navigate(`/invoicer/invoice/${v4()}`);
      }
    }
  }, [invoices.loaded]);
  return null;
}
