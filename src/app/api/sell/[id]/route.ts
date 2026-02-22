// src/app/api/sell/[id]/route.ts
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/connectDB";
import { SellService } from "@/server/modules/sell/sell.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const data = await SellService.getSingleSaleFromDB((await params).id);

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

    await SellService.deleteSaleFromDB((await params).id);

    return Response.json({
      success: true,
      message: "Stock deleted successfully",
      data: null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
