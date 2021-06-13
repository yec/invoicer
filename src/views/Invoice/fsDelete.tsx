import { deleteObject, getStorage, ref } from "@firebase/storage";

export default function fsDelete(fullPath: string) {
  const storage = getStorage();
  const deleteRef = ref(storage, fullPath);
  deleteObject(deleteRef)
    .then(() => {
      console.log("delete successful");
    })
    .catch((error) => {
      console.log("delete failed");
    });
}
