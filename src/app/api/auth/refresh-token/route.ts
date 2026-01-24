// src/app/api/auth/refresh-token/route.ts
import { AuthService } from "@/server/modules/auth/auth.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const authHeader = request.headers.get("authorization");

    const refreshToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!refreshToken) {
      throw new Error("Refresh token missing");
    }

    const result = await AuthService.refreshToken(refreshToken);

    cookieStore.set("accessToken", result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
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
