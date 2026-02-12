/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <> */
import { ProductService } from "@/server/modules/product/product.service";
import { connectDB } from "@/lib/connectDB";

// GET single product
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const product = await ProductService.getAllProductsFromDB({
    _id: (await params).id,
  });

  return Response.json({
    success: true,
    message: "Product retrieved successfully",
    data: product,
  });
}

// UPDATE product
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const body = await req.json();
  const updated = await ProductService.updateProductIntoDB(
    (await params).id,
    body,
  );

  return Response.json({
    success: true,
    message: "Product updated successfully",
    data: updated,
  });
}

// DELETE product
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const deleted = await ProductService.deleteProductFromDB((await params).id);
  return Response.json({
    success: true,
    message: "Product deleted successfully",
    data: deleted,
  });
}
