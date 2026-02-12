// src/app/api/stocks/[id]/route.ts
import { StockService } from "@/server/modules/stock/stock.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/connectDB";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const body = await request.json();
    const data = await StockService.updateStockInDB((await params).id, body);

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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    await StockService.deleteStockFromDB((await params).id);

    return Response.json({
      success: true,
      message: "Stock deleted successfully",
      data: null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
