// src/app/api/auth/change-password/route.ts
import { AuthService } from "@/server/modules/auth/auth.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth(request, ["admin", "staff"]);
    const body = await request.json();

    await AuthService.changePassword(user, body);

    return Response.json({
      success: true,
      message: "Password is updated successfully!",
      data: null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
