import React from "react";
import { InvoiceState } from "./state";
import { InvoiceService } from "./services/InvoiceService";
import { useAuth } from "./hooks/useAuth";

export function useInvoice(id: string | undefined) {
  const { user, loaded } = useAuth();
  const [invoice, setInvoice] = React.useState<InvoiceState | undefined>();
  const invoiceService = React.useMemo(() => {
    return new InvoiceService();
  }, [user, loaded]);

  React.useEffect(() => {
    const listener = invoiceService.changes(async (value) => {
      if (id && id === value.id) {
        if (!value.deleted) {
          setInvoice(await invoiceService.get(id));
        }
      }
    });

    async function getInvoice() {
      try {
        id && setInvoice(await invoiceService.get(id));
      } catch (e) {}
    }

    getInvoice();

    return () => listener && listener.cancel();
  }, [id, invoiceService]);

  return invoice;
}

export function useInvoices() {
  const { user, loaded: userLoaded } = useAuth();
  const [invoices, setInvoices] = React.useState<InvoiceState[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const invoiceService = React.useMemo(() => {
    return new InvoiceService();
  }, [user, userLoaded]);

  React.useEffect(() => {
    async function getInvoices() {
      const all = await invoiceService.getAll();
      setInvoices(all);
      setLoaded(true);
    }

    const listener = invoiceService.changes((value) => {
      getInvoices();
    });

    getInvoices();
    return () => listener && listener.cancel();
  }, [invoiceService]);

  return { items: invoices, loaded };
}
