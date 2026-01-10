// src/app/api/auth/refresh-token/route.ts
import { AuthService } from "@/server/modules/auth/auth.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      throw new Error("Refresh token missing");
    }

    const result = await AuthService.refreshToken(refreshToken);

    cookieStore.set("accessToken", result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return Response.json({
      success: true,
      message: "Access token retrieved successfully!",
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
