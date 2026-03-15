import { connectDB } from "@/lib/connectDB";
import { handleApiError } from "@/server/errors/handleApiError";
import { requireAuth } from "@/server/guards/requireAuth";
import { StatisticsService } from "@/server/modules/statistics/statistics.service";

export async function GET(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const data = await StatisticsService.getCompanyStatsFromDB("all");

    return Response.json({
      success: true,
      message: "All companies statistics retrieved successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
