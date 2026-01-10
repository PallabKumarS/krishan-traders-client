// src/app/api/sizes/route.ts
import { SizeService } from "@/server/modules/size/size.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(request: Request) {
  try {
    await requireAuth(request, ["admin"]);

    const data = await SizeService.getAllSizeFromDB();

    return Response.json({
      success: true,
      message: "Sizes retrieved successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request, ["admin"]);

    const body = await request.json();
    const data = await SizeService.createSizeIntoDB(body);

    return Response.json(
      {
        success: true,
        message: "Size created successfully",
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
