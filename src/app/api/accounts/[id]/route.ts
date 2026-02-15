import { connectDB } from "@/lib/connectDB";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { AccountService } from "@/server/modules/account/account.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const data = await AccountService.getSingleAccount((await params).id);

    return Response.json({
      success: true,
      message: "Account retrieved successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const body = await request.json();
    const data = await AccountService.updateAccount((await params).id, body);

    return Response.json({
      success: true,
      message: "Account updated successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const data = await AccountService.deleteAccount((await params).id);

    return Response.json({
      success: true,
      message: "Account deleted successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
