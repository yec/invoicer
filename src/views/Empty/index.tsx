import React from "react";
import { useNavigate } from "react-router-dom";
import { useInvoices } from "../../useInvoice";

export function Empty() {
  const navigate = useNavigate();
  const { items, loaded } = useInvoices();

  React.useEffect(() => {
    if (loaded) {
      if (items.length > 0) {
        navigate(`/invoicer/invoice/${items[0]._id}`, {
          replace: true,
        });
      }
    }
  }, [loaded, items, navigate]);
  return null;
}
