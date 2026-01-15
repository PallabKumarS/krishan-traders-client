// src/app/api/sizes/[productName]/route.ts
import { SizeService } from "@/server/modules/size/size.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const data = await SizeService.getSizeByProductFromDB(
      (
        await params
      ).productId
    );

    return Response.json({
      success: true,
      message: "Size retrieved successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const body = await request.json();
    const data = await SizeService.updateSizeIntoDB(
      (
        await params
      ).productId,
      body
    );

    return Response.json({
      success: true,
      message: "Size updated successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    await SizeService.deleteSizeFromDB((await params).productId);

    return Response.json({
      success: true,
      message: "Size deleted successfully",
      data: null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
