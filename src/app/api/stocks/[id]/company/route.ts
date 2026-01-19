import { connectDB } from "@/lib/mongodb";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { StockService } from "@/server/modules/stock/stock.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const data = await StockService.getAggregatedStocksByCompany(
      (await params).id,
    );

    return Response.json({
      success: true,
      message: "Stock updated successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
