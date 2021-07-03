import { PouchService } from "./PouchService";
import { InvoiceState, invoiceState, SetInvoiceState } from "../state";
import { v4 } from "uuid";
import deepmerge from "deepmerge";

export class InvoiceService {
  private _dbName: string;
  private _db: PouchDB.Database;
  data?: {};

  constructor(dbName: string) {
    this._dbName = dbName;
    this._db = PouchService.invoices(this._dbName);
  }

  async getAll() {
    const invoices = await this._db.allDocs<InvoiceState>({
      include_docs: true,
      descending: true,
    });

    return invoices.rows
      .flatMap((row) => (row.doc ? row.doc : []))
      .map((doc) => doc as InvoiceState);
  }

  async delete(id: string) {
    const doc = await this._db.get(id);
    return this._db.remove(doc);
  }

  lock(id: string) {
    return this._db.upsert(id, (doc: unknown) => {
      return { ...(doc as InvoiceState), status: "locked" };
    });
  }

  toggleLock(id: string) {
    return this._db.upsert<Partial<InvoiceState>>(id, (doc: unknown) => {
      return {
        ...(doc as InvoiceState),
        status:
          (doc as InvoiceState).status === "locked" ? "unlocked" : "locked",
      };
    });
  }

  get(id: string) {
    return this._db.get<InvoiceState>(id) as Promise<InvoiceState | undefined>;
  }

  async copy(id: string) {
    const { _id, _rev, ...original } = await this._db.get(id);
    this._db.put({ ...original, _id: v4() });
  }

  // save() {
  //   const invoice = {
  //     _id: this._id,
  //     ...this.data,
  //   };

  //   this._db.put(invoice);
  // }

  put(id: string, invoice: SetInvoiceState) {
    return this._db.upsert(id, (doc) => {
      return deepmerge(doc, invoice);
    });
  }

  deleteLine(id: string, key: string) {
    return this._db.upsert(id, (doc: unknown) => {
      const newDoc = doc as InvoiceState;
      delete newDoc.lines[key];
      return { ...(doc as InvoiceState) };
    });
  }

  deleteFile(id: string, key: string) {
    return this._db.upsert(id, (doc: unknown) => {
      const newDoc = doc as InvoiceState;
      delete newDoc.files[key];
      return { ...(doc as InvoiceState) };
    });
  }

  async getOrCreate(uuid: string) {
    try {
      const invoice = await this.get(uuid);
      if (invoice) {
        return invoice;
      }
    } catch (e) {
      await this._db.upsert<InvoiceState>(uuid, (doc) => {
        return { ...invoiceState, ...doc };
      });
      const res = (await this._db.get(uuid)) as InvoiceState;
      return res;
    }
  }

  changes(onChange: (value: PouchDB.Core.ChangesResponseChange<{}>) => any) {
    return this._db
      .changes({ since: "now", live: true, include_docs: false })
      .on("change", onChange);
  }
}
