
import LoginPage from "@/components/modules/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Krishan Traders | Login",
  description: "Login to your Krishan Traders account",
};

const page = () => {
  return <LoginPage />;
};

export default page;
