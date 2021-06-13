import PouchDb from "pouchdb-browser";
import memoryadapter from "pouchdb-adapter-memory";
import React from "react";
import { useAuth } from "./hooks/useAuth";
import { dbName } from "./dbName";

PouchDb.plugin(memoryadapter);

export function SyncDB() {
  const { user, password, loaded } = useAuth();
  React.useEffect(() => {
    if (user && password && loaded) {
      const _dbName = dbName(user.uid);
      const localDB = new PouchDb(_dbName, {
        adapter: "memory",
      });
      const username = user.uid;
      const remoteDB = new PouchDb(
        `https://${username}:${password}@d224310a-8908-4d94-858b-e0e7dc1e00a7-bluemix.cloudantnosqldb.appdomain.cloud/${encodeURIComponent(
          _dbName
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
