import { getStorage, ref, UploadResult, uploadString } from "firebase/storage";

export default async function imageString(
  file: File
): Promise<{ src: string; snapshot: UploadResult }> {
  const storage = getStorage();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("loadend", (fileread) => {
      if (fileread && fileread.target) {
        const storageRef = ref(storage, `images/${file.name}`);
        uploadString(storageRef, fileread.target.result as string, "data_url")
          .then((snapshot) => {
            console.log(snapshot);
            console.log("Uploaded a data_url string!");
            resolve({ src: fileread?.target?.result as string, snapshot });
          })
          .catch((r) => {
            console.log(r);
          });
      }
    });

    setTimeout(() => reject("timeout"), 10000);
  });
}
