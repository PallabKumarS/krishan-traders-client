import { connectDB } from "@/lib/connectDB";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { SellService } from "@/server/modules/sell/sell.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const data = await SellService.getSell((await params).id);

    return Response.json({
      success: true,
      message: "Sell retrieved successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const body = await request.json();
    const data = await SellService.updateSell((await params).id, body);

    return Response.json({
      success: true,
      message: "Sell updated successfully",
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

    const data = await SellService.deleteSell((await params).id);

    return Response.json({
      success: true,
      message: "Sell deleted successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
