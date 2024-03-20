import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import type { Readable } from "stream";

export const S3_REGION = "eu-central-1";

export const STORAGE_KEY = "my-image";

/**
 * Interface implemented by real S3 storage and local disk storage for offline dev
 */
export interface Bucket {
  exists: (key: string) => Promise<boolean>;
  get_byte_array: (key: string) => Promise<Uint8Array | undefined>;

  put: (key: string, value: Uint8Array | Buffer, sha256: string, meta?: Record<string, string>) => Promise<void>;

  delete: (key: string) => Promise<void>;
}

/**
 * Real S3 storage
 */
class SkS3Bucket implements Bucket {
  private bucket: string;
  private client: S3Client;

  constructor(accessKeyId: string, secretAccessKey: string, opts?: { bucket?: string }) {
    this.bucket = process.env.BUCKET_NAME ?? "my-bucket";
    this.client = new S3Client({
      region: S3_REGION,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async exists(key: string) {
    const command = new HeadObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const response = await this.client.send(command);
      console.debug("Object was found in S3", { key, httpStatusCode: response.$metadata.httpStatusCode });
      return true;
    } catch (err) {
      if (err != undefined && typeof err === "object" && "name" in err) {
        if (err.name == "NotFound") {
          console.debug("Object not found in S3", { key });
          return false;
        }
      }
      console.error("Could not HEAD from S3", { key, error: err });
      throw err;
    }
  }
  async get_byte_array(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const response = await this.client.send(command);
      console.debug("S3 GET response", response.$metadata);
      return await response.Body?.transformToByteArray();
    } catch (err) {
      console.error("Could not GET from S3", { key, error: err });
      throw err;
    }
  }

  async put(key: string, value: Uint8Array | Buffer | Readable, sha256: string, meta?: Record<string, string>) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: value,
      ChecksumSHA256: sha256,
      Metadata: meta,
    });
    try {
      const data = await this.client.send(command);
      console.debug("S3 PUT response", data.$metadata);
    } catch (err) {
      console.error("Could not PUT to S3", { error: err });
      throw err;
    }
  }

  async delete(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    try {
      const data = await this.client.send(command);
      console.debug("S3 DELETE response", data.$metadata);
    } catch (err) {
      console.error("Could not DELETE to S3", { error: err });
      throw err;
    }
  }
}

/**
 * Gets the S3 bucket
 */
export function getBucket() {
  if (process.env.AWS_ACCESS_KEY && process.env.AWS_ACCESS_SECRET) {
    const bucket = new SkS3Bucket(process.env.AWS_ACCESS_KEY, process.env.AWS_ACCESS_SECRET);
    return bucket;
  }
  console.error("Missing AWS environment variable", {
    SK_AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY != undefined,
    SK_AWS_ACCESS_SECRET: process.env.AWS_ACCESS_SECRET != undefined,
  });
  throw new Error("Internal server error");
}

export async function fetchInS3(storageKey: string) {
  const bucket = getBucket();
  const buffer = await bucket.get_byte_array(storageKey);
  if (buffer == undefined) {
    console.error("Could not get file from storage - got undefined result");
    throw new Error("Could not get file from storage");
  }
  return buffer;
}
