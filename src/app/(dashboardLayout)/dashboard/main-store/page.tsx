import MainStore from "@/components/modules/MainStore";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Main Store | Krishan Traders",
  description: "Krishan Traders - Main Store",
};

const page = () => {
  return <MainStore />;
};

export default page;
