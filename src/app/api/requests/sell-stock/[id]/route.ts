// src/app/api/requests/sale-stock/[id]/route.ts

import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/connectDB";
import { SaleRequestService } from "@/server/modules/sale-requests/sale-requests.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const body = await request.json();

    const result = await SaleRequestService.acceptSaleRequest(
      (await params).id,
      body.status,
    );

    return Response.json({
      success: true,
      message: `Sale request ${body.status}`,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
