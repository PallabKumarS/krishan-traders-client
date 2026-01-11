import { UserService } from "@/server/modules/user/user.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const result = await UserService.getAllUserFromDB(query);

    return Response.json({
      success: true,
      message: "Users retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
