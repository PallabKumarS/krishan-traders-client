// src/app/api/company/[id]/route.ts
import { CompanyService } from "@/server/modules/company/company.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/connectDB";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const body = await request.json();
    const data = await CompanyService.updateCompanyIntoDB(
      (await params).id,
      body,
    );

    return Response.json({
      success: true,
      message: "Company updated successfully",
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

    await CompanyService.deleteCompanyFromDB((await params).id);

    return Response.json({
      success: true,
      message: "Company deleted successfully",
      data: null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
