// src/app/api/stocks/[id]/route.ts
import { StockService } from "@/server/modules/stock/stock.service";
import { requireAuth } from "@/server/auth/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(request, ["admin"]);

    const body = await request.json();
    const data = await StockService.updateStockInDB(params.id, body);

    return Response.json({
      success: true,
      message: "Stock updated successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(request, ["admin"]);

    await StockService.deleteStockFromDB(params.id);

    return Response.json({
      success: true,
      message: "Stock deleted successfully",
      data: null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
