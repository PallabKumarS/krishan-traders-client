import mongoose from "mongoose";
import fs from "fs";
import path from "path";

import CompanyModel from "@/server/modules/company/company.model";
import ProductModel from "@/server/modules/product/product.model";
import SizeModel from "@/server/modules/size/size.model";
import { connectDB } from "@/lib/connectDB";

const dataPath = path.join(process.cwd(), "/src/seed");

const companies = JSON.parse(
  fs.readFileSync(path.join(dataPath, "companies.json"), "utf-8"),
);

const products = JSON.parse(
  fs.readFileSync(path.join(dataPath, "products.json"), "utf-8"),
);

const sizes = JSON.parse(
  fs.readFileSync(path.join(dataPath, "sizes.json"), "utf-8"),
);

async function seed() {
  await connectDB();
  console.log("🌱 Seeding started...");

  /* =====================
     COMPANIES
  ===================== */
  const companyMap = new Map<string, string>();

  for (const company of companies) {
    const doc =
      (await CompanyModel.findOne({ name: company.name })) ||
      (await CompanyModel.create({ name: company.name }));

    companyMap.set(company.name, doc._id.toString());
  }

  /* =====================
     PRODUCTS
  ===================== */
  const productMap = new Map<string, string>();

  for (const product of products) {
    const companyId = companyMap.get(product.companyName);
    if (!companyId) continue;

    const doc =
      (await ProductModel.findOne({
        name: product.name,
        company: companyId,
      })) ||
      (await ProductModel.create({
        name: product.name,
        company: companyId,
      }));

    productMap.set(product.name, doc._id.toString());
  }

  /* =====================
     SIZES
  ===================== */
  for (const size of sizes) {
    const productId = productMap.get(size.productName);
    if (!productId) continue;

    const label = `${size.unitQuantity} ${size.unit} X ${size.stackCount}`;

    const exists = await SizeModel.findOne({
      product: productId,
      unit: size.unit,
      unitQuantity: size.unitQuantity,
      stackCount: size.stackCount,
    });

    if (!exists) {
      await SizeModel.create({
        product: productId,
        unit: size.unit,
        unitQuantity: size.unitQuantity,
        stackCount: size.stackCount,
        label,
      });
    }
  }

  console.log("✅ Seeding completed");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});
