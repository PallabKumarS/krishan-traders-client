// src/app/api/requests/add-stock/route.ts

import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/connectDB";
import { StockAddRequestService } from "@/server/modules/stock-requests/stock-requests.service";

export async function GET(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const result = await StockAddRequestService.getAllStockAddRequests();

    return Response.json({
      success: true,
      message: "Stock add requests retrieved successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["staff", "admin"]);

    const body = await request.json();
    const user = request.user;
    const result = await StockAddRequestService.createStockAddRequest(
      user,
      body,
    );

    return Response.json({
      success: true,
      message: "Stock add request created successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
