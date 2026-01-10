// src/app/api/company/[id]/products/route.ts
import { CompanyService } from "@/server/modules/company/company.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const data = await CompanyService.getProductsNameByCompanyFromDB(params.id);

    return Response.json({
      success: true,
      message: "Products retrieved successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
