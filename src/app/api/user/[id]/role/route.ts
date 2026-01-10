// src/app/api/users/[id]/role/route.ts
import { UserService } from "@/server/modules/user/user.service";
import { requireAuth } from "@/server/auth/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
