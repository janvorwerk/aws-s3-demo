"use client";
export async function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("abort", () => reject(new Error("Aborted")));
    reader.addEventListener("error", () => reject(new Error("An error ocurred")));
    reader.addEventListener("load", () => {
      try {
        if (!reader.result) {
          reject(new Error("Could not read file"));
          return;
        }
        const buffer = reader.result as ArrayBuffer;
        resolve(buffer);
      } catch (err) {
        reject(err);
      }
    });
    reader.readAsArrayBuffer(file);
  });
}
