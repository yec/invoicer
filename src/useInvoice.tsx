import React from "react";
import { InvoiceState } from "./state";
import { InvoiceService } from "./services/InvoiceService";

export function useInvoice(id: string | undefined) {
  const [invoice, setInvoice] = React.useState<InvoiceState | undefined>();

  React.useEffect(() => {
    const listener = InvoiceService.changes(async () => {
      id && setInvoice(await InvoiceService.get(id));
    });

    async function getInvoice() {
      try {
        id && setInvoice(await InvoiceService.get(id));
      } catch (e) {}
    }

    getInvoice();

    return () => listener && listener.cancel();
  }, [id]);

  return invoice;
}
