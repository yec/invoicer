import PouchDb from "pouchdb-browser";
import upsert from "pouchdb-upsert";
import memoryadapter from "pouchdb-adapter-memory";
import { InvoiceState } from "../state";

PouchDb.plugin(upsert);
PouchDb.plugin(memoryadapter);

export class PouchService {
  static invoices(dbName: string) {
    return new PouchDb<InvoiceState>(dbName, {
      adapter: "memory",
    });
  }
}
