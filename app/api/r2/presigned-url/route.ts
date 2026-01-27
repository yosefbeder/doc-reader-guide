import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cookies } from "next/headers";

const S3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const file = searchParams.get("file");
  const type = searchParams.get("type");

  if (!file || !type) {
    return NextResponse.json(
      { error: "Missing file or type" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt");

  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const authRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: {
        authorization: `Bearer ${jwt.value}`,
      },
    });

    if (!authRes.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await authRes.json();
    if (json.data.user.roleId === 3) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth check failed", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  try {
    const command = new PutObjectCommand({
      Bucket: "drg",
      Key: file,
      ContentType: type,
    });

    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_URL}/${file}`;

    return NextResponse.json({ signedUrl, publicUrl });
  } catch (error) {
    console.error("Error generating presigned URL", error);
    return NextResponse.json(
      { error: "Error generating URL" },
      { status: 500 }
    );
  }
}
