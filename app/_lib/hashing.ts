import { createHash } from "crypto";
import { sleep } from "./time";

export async function computeHashValue(buffer: ArrayBuffer) {
  await sleep(0); // make signature async without a warning
  return createHash("sha256").update(Buffer.from(buffer)).digest("base64");
}
