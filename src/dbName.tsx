export function dbName(uid: string) {
  return `invoices_${uid.toLowerCase()}`;
}
