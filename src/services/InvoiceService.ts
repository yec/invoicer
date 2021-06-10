import { PouchService } from "./PouchService";
import { InvoiceState, invoiceState, SetInvoiceState } from "../state";
import { v4 } from "uuid";
import deepmerge from "deepmerge";

export class InvoiceService {
  _id: string;
  _db: PouchDB.Database;
  data?: {};

  constructor(uuid: string) {
    this._id = uuid;
    this._db = PouchService.invoices();
  }

  static async getAll() {
    const db = PouchService.invoices();
    const invoices = await db.allDocs<InvoiceState>({
      include_docs: true,
      descending: true,
    });

    return invoices.rows
      .flatMap((row) => (row.doc ? row.doc : []))
      .map((doc) => doc as InvoiceState);
  }

  static async delete(id: string) {
    const db = PouchService.invoices();
    const doc = await db.get(id);
    return db.remove(doc);
  }

  static async lock(id: string) {
    const db = PouchService.invoices();
    return db.upsert(id, (doc: unknown) => {
      return { ...(doc as InvoiceState), status: "locked" };
    });
  }

  static async toggleLock(id: string) {
    const db = PouchService.invoices();
    return db.upsert<Partial<InvoiceState>>(id, (doc: unknown) => {
      return {
        ...(doc as InvoiceState),
        status:
          (doc as InvoiceState).status === "locked" ? "unlocked" : "locked",
      };
    });
  }

  static async get(id: string) {
    const db = PouchService.invoices();
    return db.get<InvoiceState>(id) as Promise<InvoiceState | undefined>;
  }

  static async copy(id: string) {
    const db = PouchService.invoices();
    const { _id, _rev, ...original } = await db.get(id);
    db.put({ ...original, _id: v4() });
  }

  save() {
    const invoice = {
      _id: this._id,
      ...this.data,
    };

    this._db.put(invoice);
  }

  static put(id: string, invoice: SetInvoiceState) {
    const db = PouchService.invoices();

    return db.upsert(id, (doc) => {
      return deepmerge(doc, invoice);
    });
  }

  static deleteFile(id: string, key: string) {
    const db = PouchService.invoices();

    return db.upsert(id, (doc: unknown) => {
      const newDoc = doc as InvoiceState;
      delete newDoc.files[key];
      return { ...(doc as InvoiceState) };
    });
  }

  static async getOrCreate(uuid: string) {
    const db = PouchService.invoices();
    try {
      const invoice = await this.get(uuid);
      if (invoice) {
        return invoice;
      }
    } catch (e) {
      await db.upsert<InvoiceState>(uuid, (doc) => {
        return { ...invoiceState, ...doc };
      });
      const res = (await db.get(uuid)) as InvoiceState;
      return res;
    }
  }

  static changes(
    onChange: (value: PouchDB.Core.ChangesResponseChange<InvoiceState>) => any
  ) {
    const db = PouchService.invoices();

    return db
      .changes({ since: "now", live: true, include_docs: false })
      .on("change", onChange);
  }
}
