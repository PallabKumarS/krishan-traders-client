import { NextResponse } from "next/server";
import { ProductService } from "@/server/modules/product/product.service";
import { connectDB } from "@/lib/mongodb";

// GET all products
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const company = searchParams.get("company");

  const products = await ProductService.getAllProductsFromDB(
    company ? { company } : undefined
  );

  return NextResponse.json(products);
}

// CREATE product
export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const product = await ProductService.createProductIntoDB(body);

  return NextResponse.json(product, { status: 201 });
}
