import React from "react";
import { InvoiceState } from "./state";
import { InvoiceService } from "./services/InvoiceService";

export function useInvoice(id: string | undefined) {
  const [invoice, setInvoice] = React.useState<InvoiceState | undefined>();

  React.useEffect(() => {
    const listener = InvoiceService.changes(async (value) => {
      if (id && id === value.id) {
        setInvoice(await InvoiceService.get(id));
      }
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

export function useInvoices() {
  const [invoices, setInvoices] = React.useState<InvoiceState[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    async function getInvoices() {
      const all = await InvoiceService.getAll();
      setInvoices(all);
      setLoaded(true);
    }

    InvoiceService.changes((value) => {
      getInvoices();
    });

    getInvoices();
  }, []);

  return { items: invoices, loaded };
}
