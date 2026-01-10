import PendingStockManagement from "@/components/modules/PendingStockManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Pending Stocks | Krishan Traders",
	description: "Accept or reject Pending Stocks",
};

const page = async ({
	searchParams,
}: {
	searchParams: Promise<Record<string, unknown>>;
}) => {
	const query = await searchParams;

	return (
		<section>
			<h1 className="text-3xl font-bold mb-6">Pending Transactions</h1>
			<p className="text-muted-foreground mb-8">
				Accept or Reject transaction records for your business.
			</p>

			<PendingStockManagement query={query} />
		</section>
	);
};

export default page;
