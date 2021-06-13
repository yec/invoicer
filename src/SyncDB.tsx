import PouchDb from "pouchdb-browser";
import React from "react";
import { useAuth } from "./hooks/useAuth";

export function SyncDB() {
  const { user, password, loaded } = useAuth();
  React.useEffect(() => {
    if (user && password && loaded) {
      const dbName = "invoices_" + user.uid.toLowerCase();
      const localDB = new PouchDb(dbName);
      const username = user.uid;
      const remoteDB = new PouchDb(
        `https://${username}:${password}@d224310a-8908-4d94-858b-e0e7dc1e00a7-bluemix.cloudantnosqldb.appdomain.cloud/${encodeURIComponent(
          dbName
        )}`
      );

      const syncHandler = localDB.sync(remoteDB, {
        live: true,
        retry: true,
      });

      return () => syncHandler.cancel();
    }
  }, [user, password, loaded]);
  return null;
}
