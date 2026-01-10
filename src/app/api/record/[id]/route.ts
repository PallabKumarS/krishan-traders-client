import { RecordService } from "@/server/modules/record/record.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(request, ["admin"]);

    await RecordService.deleteRecordFromDB(params.id);

    return Response.json({
      success: true,
      message: "Record deleted successfully",
      data: null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
