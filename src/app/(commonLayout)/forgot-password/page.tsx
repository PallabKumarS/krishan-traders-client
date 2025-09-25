import ForgotPasswordPage from "@/components/modules/ForgotPasswordPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Krishan Traders",
  description: "Reset your password for Krishan Traders",
};

const page = () => {
  return <ForgotPasswordPage />;
};

export default page;
