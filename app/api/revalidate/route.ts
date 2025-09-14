import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { path } = await req.json();
  revalidatePath(path);
  return Response.json({ revalidated: true });
}
