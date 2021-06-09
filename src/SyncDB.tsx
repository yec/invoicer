import PouchDb from "pouchdb-browser";
import React, { useContext } from "react";
import { AuthContext } from "./hooks/useAuth";

export function SyncDB() {
  const authContext = useContext(AuthContext);
  React.useEffect(() => {
    if (authContext.user) {
      const localDB = new PouchDb("invoices");
      const dbName = "invoices_" + authContext.user?.uid.toLowerCase();
      const username = authContext.user?.uid;
      const remoteDB = new PouchDb(
        `https://${username}:${username}@d224310a-8908-4d94-858b-e0e7dc1e00a7-bluemix.cloudantnosqldb.appdomain.cloud/${encodeURIComponent(
          dbName
        )}`
      );

      const syncHandler = localDB.sync(remoteDB, {
        live: true,
        retry: true,
      });

      return () => syncHandler.cancel();
    }
  }, [authContext.user]);
  return null;
}
