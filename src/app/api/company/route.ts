// src/app/api/company/route.ts
import { CompanyService } from "@/server/modules/company/company.service";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { connectDB } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const data = await CompanyService.getAllCompanyFromDB(query);

    return Response.json({
      success: true,
      message: "Company retrieved successfully",
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
    const data = await CompanyService.createCompanyIntoDB(body);

    return Response.json(
      {
        success: true,
        message: "Company created successfully",
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
