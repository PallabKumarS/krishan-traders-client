import { connectDB } from "@/lib/connectDB";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { StatisticsService } from "@/server/modules/statistics/statistics.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff", "subAdmin"]);

    const companyId = (await params).companyId;
    const data = await StatisticsService.getCompanyStatsFromDB(companyId);

    return Response.json({
      success: true,
      message: "Company statistics retrieved successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
