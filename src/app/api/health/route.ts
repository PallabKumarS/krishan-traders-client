import { connectDB } from "@/lib/connectDB";

export async function GET() {
  await connectDB();
  return Response.json({ status: "ok", db: "connected" });
}
