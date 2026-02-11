// src/app/api/records/[id]/accept-sell-stock/route.ts
import { RecordService } from "@/server/modules/record/record.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/mongodb";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const body = await request.json();
    const data = await RecordService.acceptSellStockInDB(
      (
        await params
      ).id,
      body
    );

    return Response.json({
      success: true,
      message: "Stock accepted successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
