import { FilePicker } from "@/app/_lib/file-picker";
import { getBucket, STORAGE_KEY } from "@sk/aws/s3";

export const dynamic = "force-dynamic";

export default async function Home() {
  const bucket = getBucket();
  const exists = await bucket.exists(STORAGE_KEY);

  return (
    <main className="flex min-h-screen flex-col p-24 max-w-md">
      <div>Pick an image to store on S3</div>
      <FilePicker exists={exists} />
    </main>
  );
}
