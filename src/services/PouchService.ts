import PouchDb from "pouchdb-browser";
import upsert from "pouchdb-upsert";
import { InvoiceState } from "../state";

PouchDb.plugin(upsert);

export class PouchService {
  static invoices() {
    return new PouchDb<InvoiceState>("invoices");
  }
}
