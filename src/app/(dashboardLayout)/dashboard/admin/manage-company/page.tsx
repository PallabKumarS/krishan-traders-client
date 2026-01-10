import CompanyManagement from "@/components/modules/CompanyManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Manage Company | Krishan Traders",
	description: "Add and manage company for Krishan Traders",
};

const page = () => {
	return <CompanyManagement />;
};

export default page;
