/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <> */
import { NextResponse } from "next/server";
import { ProductService } from "@/server/modules/product/product.service";
import { connectDB } from "@/lib/mongodb";

// GET single product
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const product = await ProductService.getAllProductsFromDB({
    _id: (await params).id,
  });

  return NextResponse.json(product[0] || null);
}

// UPDATE product
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const body = await req.json();
  const updated = await ProductService.updateProductIntoDB(
    (
      await params
    ).id,
    body
  );

  return NextResponse.json(updated);
}

// DELETE product
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const deleted = await ProductService.deleteProductFromDB((await params).id);
  return NextResponse.json(deleted);
}
