// src/app/api/auth/register/route.ts
import { AuthService } from "@/server/modules/auth/auth.service";
import { handleApiError } from "@/server/errors/handleApiError";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await AuthService.registerUser(body);

    return Response.json(
      {
        success: true,
        message: "User created successfully",
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
