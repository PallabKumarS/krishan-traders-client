import { connectDB } from "@/lib/connectDB";
import { requireAuth } from "@/server/guards/requireAuth";
import { handleApiError } from "@/server/errors/handleApiError";
import { AccountTransactionService } from "@/server/modules/accountTransactions/transactions.service";

export async function GET(request: Request) {
  try {
    await connectDB();
    await requireAuth(request, ["admin", "staff"]);

    const data = await AccountTransactionService.getTransactions();

    return Response.json({
      success: true,
      message: "Transactions retrieved successfully",
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
    const data = await AccountTransactionService.createTransaction(body);

    return Response.json(
      {
        success: true,
        message: "Transaction created successfully",
        data,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
