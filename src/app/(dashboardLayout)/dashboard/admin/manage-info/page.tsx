import { Metadata } from "next";
import ManageInfo from "./ManageInfo";

export const metadata: Metadata = {
  title: "Manage Info - KT Admin Dashboard",
  description: "Manage information in the admin dashboard.",
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, unknown>>;
}) => {
  const query = await searchParams;
  return <ManageInfo query={query} />;
};

export default page;
