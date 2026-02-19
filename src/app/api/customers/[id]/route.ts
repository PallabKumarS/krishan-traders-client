import { connectDB } from "@/lib/connectDB";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { CustomerService } from "@/server/modules/customer/customer.service";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const data = await CustomerService.getCustomer(params.id);

    return Response.json({
      success: true,
      message: "Customer retrieved successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const body = await request.json();
    const data = await CustomerService.updateCustomer(params.id, body);

    return Response.json({
      success: true,
      message: "Customer updated successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const data = await CustomerService.deleteCustomer(params.id);

    return Response.json({
      success: true,
      message: "Customer deleted successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
