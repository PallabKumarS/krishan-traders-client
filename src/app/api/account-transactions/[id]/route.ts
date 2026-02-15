import { connectDB } from "@/lib/connectDB";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { AccountTransactionService } from "@/server/modules/accountTransactions/transactions.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    await requireAuth(request, ["admin"]);

    const body = await request.json();
    const data = await AccountTransactionService.updateTransaction(
      (await params).id,
      body,
    );

    return Response.json({
      success: true,
      message: "Transaction updated successfully",
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

    const data = await AccountTransactionService.deleteTransaction(
      (await params).id,
    );

    return Response.json({
      success: true,
      message: "Transaction deleted successfully",
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
