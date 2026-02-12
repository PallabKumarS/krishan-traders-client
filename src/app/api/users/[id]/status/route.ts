// src/app/api/users/[id]/status/route.ts
import { UserService } from "@/server/modules/user/user.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/connectDB";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const data = await UserService.updateUserStatusIntoDB((await params).id);

    return Response.json({
      success: true,
      message: "User status updated successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
