import { Metadata } from "next";
import ManageInfo from "./ManageInfo";
import { getCompaniesPromise, getProductsPromise, getSizesPromise } from "./utils";

export const metadata: Metadata = {
  title: "Manage Info - KT Admin Dashboard",
  description: "Manage information in the admin dashboard.",
};

const ManageInfoPage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, unknown>>;
}) => {
  const query = await searchParams;

  const initialCompaniesPromise = getCompaniesPromise();
  const initialProductsPromise = getProductsPromise("all");
  const initialSizesPromise = getSizesPromise();

  return (
    <ManageInfo
      query={query}
      initialCompaniesPromise={initialCompaniesPromise}
      initialProductsPromise={initialProductsPromise}
      initialSizesPromise={initialSizesPromise}
    />
  );
};

export default ManageInfoPage;

