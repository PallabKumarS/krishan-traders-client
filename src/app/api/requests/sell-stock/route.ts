// src/app/api/requests/sell-stock/route.ts

import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/connectDB";
import { SaleRequestService } from "@/server/modules/sale-requests/sale-requests.service";

export async function GET(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const result = await SaleRequestService.getAllSaleRequests();

    return Response.json({
      success: true,
      message: "Sale requests retrieved successfully",
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
    const result = await SaleRequestService.createSaleRequest(user, body);

    return Response.json({
      success: true,
      message: "Sale request created successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
