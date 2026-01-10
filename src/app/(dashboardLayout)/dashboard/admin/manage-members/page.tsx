import UserManagement from "@/components/modules/UserManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Manage Members | Krishan Traders",
	description: "Add and manage team members for Krishan Traders",
};

const ManageMembersPage = async ({
	searchParams,
}: {
	searchParams: Promise<Record<string, unknown>>;
}) => {
	const query = await searchParams;

	return (
		<div className="container mx-auto">
			<h1 className="text-3xl font-bold mb-6">Manage Team Members</h1>
			<p className="text-muted-foreground mb-8">
				Add, edit, or remove team members and manage their access permissions.
			</p>

			{/* Members list will be added here */}
			<UserManagement query={query} />
		</div>
	);
};

export default ManageMembersPage;
