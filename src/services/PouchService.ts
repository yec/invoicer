import PouchDb from "pouchdb-browser";
import upsert from "pouchdb-upsert";

PouchDb.plugin(upsert);

export class PouchService {
  static invoices() {
    return new PouchDb("invoices");
  }
}
