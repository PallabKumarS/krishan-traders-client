// src/app/api/records/[id]/accept-sell-stock/route.ts
import { RecordService } from "@/server/modules/record/record.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(request, ["admin"]);

    const body = await request.json();
    const data = await RecordService.acceptSellStockInDB(params.id, body);

    return Response.json({
      success: true,
      message: "Stock accepted successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
