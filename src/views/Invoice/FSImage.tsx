import React from "react";
import {
  FullMetadata,
  getDownloadURL,
  getMetadata,
  getStorage,
  ref,
} from "@firebase/storage";

export default function FSImage({ fullPath }: { fullPath: string }) {
  const [file, setFile] =
    React.useState<{ src: string; metadata: FullMetadata } | undefined>();
  React.useEffect(() => {
    const storage = getStorage();
    const imageRef = ref(storage, fullPath);
    Promise.all([getDownloadURL(imageRef), getMetadata(imageRef)]).then(
      ([src, metadata]) => {
        setFile({ src, metadata });
      }
    );
  }, [fullPath]);
  return <>{file && <img src={file.src} alt={file.metadata.name} />}</>;
}
