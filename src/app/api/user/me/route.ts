// src/app/api/users/me/route.ts
import { UserService } from "@/server/modules/user/user.service";
import { requireAuth } from "@/server/auth/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request, ["admin", "staff"]);

    const data = await UserService.getMeFromDB(user.userId);

    return Response.json({
      success: true,
      message: "User retrieved successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
