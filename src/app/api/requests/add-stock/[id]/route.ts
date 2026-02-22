// src/app/api/requests/add-stock/[id]/route.ts

import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/connectDB";
import { StockAddRequestService } from "@/server/modules/stock-requests/stock-requests.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const body = await request.json();

    const result = await StockAddRequestService.acceptStockAddRequest(
      (await params).id,
      body.status,
    );

    return Response.json({
      success: true,
      message: `Stock add request ${body.status}`,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
