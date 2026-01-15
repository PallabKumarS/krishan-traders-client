// src/app/api/records/add-stock/route.ts
import { RecordService } from "@/server/modules/record/record.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const body = await request.json();
    const data = await RecordService.requestAddStockToDB(body);

    return Response.json(
      {
        success: true,
        message: "Stock added successfully",
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
