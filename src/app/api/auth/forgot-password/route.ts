// src/app/api/auth/forgot-password/route.ts
import { AuthService } from "@/server/modules/auth/auth.service";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/connectDB";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();
    await AuthService.forgotPassword(email);

    return Response.json({
      success: true,
      message: "Password reset code is sent to your email",
      data: null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
