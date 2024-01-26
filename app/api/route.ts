import { computeHashValue } from "@/app/_lib/hashing";
import { fetchInS3, getBucket, STORAGE_KEY } from "@/app/_lib/s3";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  console.info("Uploading file");
  const buffer = Buffer.from(await request.arrayBuffer());

  try {
    const hash = await computeHashValue(buffer);
    const bucket = getBucket();
    await bucket.put(STORAGE_KEY, buffer, hash);
    console.info("Uploaded file OK");
    return NextResponse.json({ message: ReasonPhrases.OK }, { status: StatusCodes.OK });
  } catch (error) {
    console.error("Could not store to S3", error);
    return NextResponse.json(
      { message: ReasonPhrases.INTERNAL_SERVER_ERROR },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    console.info("Fetching file from S3", { STORAGE_KEY });
    const buffer = await fetchInS3(STORAGE_KEY);
    console.info("Returning file to browser");
    return new NextResponse(buffer, {
      headers: {
        "content-disposition": `attachment; filename="image.jpeg"`,
      },
    });
  } catch (error) {
    console.error("Could not get in S3", error);
    return NextResponse.json(
      { message: ReasonPhrases.INTERNAL_SERVER_ERROR },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  console.info("Deleting file from S3", { STORAGE_KEY });

  try {
    const bucket = getBucket();
    await bucket.delete(STORAGE_KEY);
    console.info("Deleted OK");
    return NextResponse.json({ message: ReasonPhrases.OK }, { status: StatusCodes.OK });
  } catch (error) {
    console.error("Could not delete in S3", error);
    return NextResponse.json(
      { message: ReasonPhrases.INTERNAL_SERVER_ERROR },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
