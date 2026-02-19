import { connectDB } from "@/lib/connectDB";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { SellService } from "@/server/modules/sell/sell.service";

export async function GET(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const data = await SellService.getAllSells();

    return Response.json({
      success: true,
      message: "Sells retrieved successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const body = await request.json();
    const data = await SellService.createSell(body);

    return Response.json(
      {
        success: true,
        message: "Sell created successfully",
        data,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
