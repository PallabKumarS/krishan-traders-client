// src/app/api/records/sell-stock/route.ts
import { RecordService } from "@/server/modules/record/record.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";

export async function PATCH(request: Request) {
  try {
    await requireAuth(request, ["admin", "staff"]);

    const body = await request.json();
    const data = await RecordService.sellStockFromDB(body);

    return Response.json({
      success: true,
      message: "Stock sold successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
