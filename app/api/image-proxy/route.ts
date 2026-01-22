import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");

  if (!name) {
    return new NextResponse("Missing name parameter", { status: 400 });
  }

  try {
    const imageUrl = `${process.env.NEXT_PUBLIC_STATIC_URL}/image/${name}`;
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new NextResponse("Failed to fetch image", {
        status: response.status,
      });
    }

    const blob = await response.blob();
    const headers = new Headers();
    headers.set("Content-Type", blob.type);

    return new NextResponse(blob, { status: 200, headers });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
