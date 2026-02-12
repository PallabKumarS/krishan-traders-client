import { connectDB } from "@/lib/connectDB";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { SizeService } from "@/server/modules/size/size.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const data = await SizeService.getSizeByProductFromDB((await params).id);

    return Response.json({
      success: true,
      message: "Size retrieved successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
