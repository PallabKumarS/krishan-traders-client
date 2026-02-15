import { connectDB } from "@/lib/connectDB";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { AccountService } from "@/server/modules/account/account.service";

export async function GET(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const data = await AccountService.getAllAccounts();

    return Response.json({
      success: true,
      message: "Accounts retrieved successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const body = await request.json();
    const data = await AccountService.createAccount(body);

    return Response.json(
      {
        success: true,
        message: "Account created successfully",
        data,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
