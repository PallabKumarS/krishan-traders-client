import { connectDB } from "@/lib/connectDB";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { SellService } from "@/server/modules/sell/sell.service";

export async function GET(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const result = await SellService.getAllSalesFromDB();

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
    await requireAuth(request, ["admin"]);

    const body = await request.json();
    const user = request.user;
    const result = await SellService.createSellIntoDB(user, body);

    return Response.json({
      success: true,
      message: "Sale request created successfully",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
