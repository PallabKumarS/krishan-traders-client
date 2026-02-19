import { connectDB } from "@/lib/connectDB";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { CustomerService } from "@/server/modules/customer/customer.service";

export async function GET(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const data = await CustomerService.getAllCustomers();

    return Response.json({
      success: true,
      message: "Customers retrieved successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const body = await request.json();
    const data = await CustomerService.createCustomer(body);

    return Response.json(
      {
        success: true,
        message: "Customer created successfully",
        data,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
