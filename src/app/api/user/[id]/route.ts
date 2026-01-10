// src/app/api/users/[id]/route.ts
import { UserService } from "@/server/modules/user/user.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(request, ["admin", "staff"]);

    const body = await request.json();
    const data = await UserService.updateUserInDB(params.id, body);

    return Response.json({
      success: true,
      message: "User updated successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(request, ["admin"]);

    await UserService.deleteUserFromDB(params.id);

    return Response.json({
      success: true,
      message: "User deleted successfully",
      data: null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
