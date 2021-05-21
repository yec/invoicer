import React from "react";

function dropHandler(ev: React.DragEvent<HTMLDivElement>) {
  console.log("File(s) dropped");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  const files: File[] = [];

  if (ev.dataTransfer.items) {
    console.log("Use DataTransferItemList");

    // Use DataTransferItemList interface to access the file(s)
    for (let i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === "file") {
        var file = ev.dataTransfer.items[i].getAsFile();
        file && console.log("... file[" + i + "].name = " + file.name);
        file && files.push(file);
      }
    }
    return files;
  } else {
    console.log("Use DataTransfer");

    // Use DataTransfer interface to access the file(s)
    for (let i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log(
        "... file[" + i + "].name = " + ev.dataTransfer.files[i].name
      );
      files.push(ev.dataTransfer.files[i]);
    }
    return files;
  }
}

export function FileDrop({
  onFiles,
  className,
}: {
  className?: string;
  onFiles: (files: File[]) => void;
}) {
  return (
    <div
      id="drop_zone"
      className={`${className} rounded-3xl border-dashed border-4 border-gray-400 h-28 flex justify-center items-center`}
      onDragOver={(ev) => {
        console.log("File(s) in drop zone");
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
      }}
      onDrop={(ev) => onFiles(dropHandler(ev))}
    >
      <p className="text-gray-500 font-semibold">
        Drag and drop attachments here ...
      </p>
    </div>
  );
}
