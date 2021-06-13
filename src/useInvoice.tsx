import React from "react";
import { InvoiceState } from "./state";
import { InvoiceService } from "./services/InvoiceService";
import { useAuth } from "./hooks/useAuth";
import { dbName } from "./dbName";

export function useInvoice(id: string | undefined) {
  const { user } = useAuth();
  const [invoice, setInvoice] = React.useState<InvoiceState | undefined>();
  const invoiceService = React.useMemo(() => {
    return user && new InvoiceService(dbName(user.uid));
  }, [user]);

  React.useEffect(() => {
    const listener =
      invoiceService &&
      invoiceService.changes(async (value) => {
        if (id && id === value.id) {
          if (!value.deleted) {
            setInvoice(await invoiceService.get(id));
          }
        }
      });

    async function getInvoice() {
      try {
        id && invoiceService && setInvoice(await invoiceService.get(id));
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
    return user && new InvoiceService(dbName(user.uid));
  }, [user]);

  React.useEffect(() => {
    async function getInvoices() {
      if (invoiceService) {
        const all = await invoiceService.getAll();
        setInvoices(all);
        setLoaded(true);
      }
    }

    const listener =
      invoiceService &&
      invoiceService.changes((value) => {
        getInvoices();
      });

    getInvoices();
    return () => listener && listener.cancel();
  }, [invoiceService]);

  return { items: invoices, loaded };
}
