"use client";

import { readFile } from "@/app/_lib/file-reader";
import { StatusCodes } from "http-status-codes";
import { useState } from "react";

export function FilePicker({ exists }: { exists: boolean }) {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [ready, setReady] = useState(exists);

  async function uploadFile() {
    if (!file) return;
    const name = file.name;
    const buffer = await readFile(file);
    const response = await fetch("/api", {
      method: "POST",
      body: buffer,
    });
    if (response.status === StatusCodes.OK) {
      setReady(true);
    } else {
      window.alert("Failure to upload");
    }
  }

  async function deleteFile() {
    const response = await fetch("/api", {
      method: "DELETE",
    });
    if (response.status === StatusCodes.OK) {
      setReady(false);
    } else {
      window.alert("Failure to delete");
    }
  }

  async function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]!);
      e.target.value = ""; // https://stackoverflow.com/a/56258902/5690147
    }
  }
  return (
    <div className="flex flex-col gap-4">
      <button className="bg-blue-700 text-white p-2 rounded cursor-pointer">
        <label htmlFor="filePick" className="cursor-pointer">
          Pick a JPEG image
        </label>
      </button>
      <input id="filePick" className="h-0 w-20 opacity-0" type="file" accept="image/jpeg" onChange={onSelectFile} />
      {file && <div>Ready to upload {file.name}</div>}
      <button
        onClick={uploadFile}
        disabled={file == undefined}
        className="bg-blue-700 cursor-pointer disabled:cursor-not-allowed text-white p-2 rounded disabled:opacity-40 disabled:grayscale"
      >
        Upload file
      </button>

      {ready && (
        <div className="flex gap-2 items-center">
          <div>Ready to</div>
          <a href="/api" className="text-blue-700 underline">
            download
          </a>
          <div>or</div>
          <button
            onClick={deleteFile}
            className="bg-orange-700 cursor-pointer disabled:cursor-not-allowed text-white px-2 py-1 text-sm rounded disabled:opacity-40 disabled:grayscale"
          >
            DELETE
          </button>
        </div>
      )}
    </div>
  );
}
