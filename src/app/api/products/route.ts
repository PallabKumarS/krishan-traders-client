import { ProductService } from "@/server/modules/product/product.service";
import { connectDB } from "@/lib/mongodb";

// GET all products
export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const query = Object.fromEntries(searchParams.entries());

  const products = await ProductService.getAllProductsFromDB(query);

  return Response.json({
    success: true,
    message: "Products retrieved successfully",
    data: products,
  });
}

// CREATE product
export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  console.log(body);
  const product = await ProductService.createProductIntoDB(body);

  return Response.json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
}
