export async function computeHashValue(buffer: ArrayBuffer) {
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return bytesToBase64(hash);
}

function bytesToBase64(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export { insecureHashCode } from "./common";
