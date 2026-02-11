import { RecordService } from "@/server/modules/record/record.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    await RecordService.deleteRecordFromDB((await params).id);

    return Response.json({
      success: true,
      message: "Record deleted successfully",
      data: null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
