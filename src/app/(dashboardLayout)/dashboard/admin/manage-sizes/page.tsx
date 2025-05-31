import SizeManagement from "@/components/modules/SizeManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Sizes | Krishan Traders",
  description: "Add and manage product stock sizes for Krishan Traders",
};

const page = () => {
  return <SizeManagement />;
};

export default page;
