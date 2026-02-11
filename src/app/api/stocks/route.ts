// src/app/api/stocks/route.ts
import { StockService } from "@/server/modules/stock/stock.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const data = await StockService.getAllStockFromDB(query);

    return Response.json({
      success: true,
      message: "Stocks retrieved successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const body = await request.json();
    const data = await StockService.addStockInDB(body);

    return Response.json(
      {
        success: true,
        message: "Stock created successfully",
        data,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
