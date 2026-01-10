// src/app/api/auth/reset-password/route.ts
import { AuthService } from "@/server/modules/auth/auth.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(request: Request) {
  try {
    const { code, password, email } = await request.json();

    await AuthService.resetPassword(code, password, email);

    return Response.json({
      success: true,
      message: "Password is reset successfully!",
      data: null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
