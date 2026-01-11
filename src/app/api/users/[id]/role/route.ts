// src/app/api/users/[id]/role/route.ts
import { UserService } from "@/server/modules/user/user.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/mongodb";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const body = await request.json();
    const data = await UserService.updateUserRoleIntoDB(params.id, body);

    return Response.json({
      success: true,
      message: "User role updated successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
