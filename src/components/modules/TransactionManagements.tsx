"use client";

import { getAllRecords } from "@/services/RecordService";
import { TMeta, TRecord } from "@/types";
import { useEffect, useState } from "react";
import LoadingData from "../shared/LoadingData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecordCard from "../modules/RecordCard";
import { PaginationComponent } from "../shared/PaginationComponent";
import { Package } from "lucide-react";
import { toast } from "sonner";

type StatusType = "" | "pending" | "rejected" | "expired";

const TransactionManagements = ({
	query,
}: {
	query: Record<string, unknown>;
}) => {
	const [records, setRecords] = useState<TRecord[]>([]);
	const [meta, setMeta] = useState<TMeta>();
	const [isFetching, setIsFetching] = useState(true);
	const [activeStatus, setActiveStatus] = useState<StatusType>("");

	useEffect(() => {
		const fetchRecords = async () => {
			setIsFetching(true);
			try {
				const res = await getAllRecords({
					...query,
					status: activeStatus,
					sort: "-createdAt",
				});

				if (res.success) {
					setRecords(res.data);
					setMeta(res.meta);
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				toast.error(error.message);
			} finally {
				setIsFetching(false);
			}
		};

		fetchRecords();
	}, [query, activeStatus]);

	const handleTabChange = (value: string) => {
		setActiveStatus(value as StatusType);
	};

	return (
		<div className="space-y-6">
			<Tabs defaultValue="" onValueChange={handleTabChange} className="w-full">
				<div className="overflow-x-auto pb-2">
					<TabsList className="w-full md:w-auto">
						<TabsTrigger value="">All</TabsTrigger>
						<TabsTrigger value="pending">Pending</TabsTrigger>
						<TabsTrigger value="rejected">Rejected</TabsTrigger>
						<TabsTrigger value="rejected">Expired</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="" className="mt-4">
					{renderRecordsList()}
				</TabsContent>
				<TabsContent value="pending" className="mt-4">
					{renderRecordsList()}
				</TabsContent>
				<TabsContent value="rejected" className="mt-4">
					{renderRecordsList()}
				</TabsContent>
				<TabsContent value="expired" className="mt-4">
					{renderRecordsList()}
				</TabsContent>
			</Tabs>

			{meta && <PaginationComponent meta={meta} />}
		</div>
	);

	function renderRecordsList() {
		if (isFetching) return <LoadingData />;

		if (records.length === 0) {
			return (
				<div className="text-center py-12 bg-muted/30 rounded-lg">
					<Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
					<h3 className="text-xl font-medium mb-2">No Transactions Found</h3>
					<p className="text-muted-foreground">
						There are no transactions matching your current filter.
					</p>
				</div>
			);
		}

		return (
			<div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-4 mb-10">
				{records.map((record) => (
					<RecordCard key={record._id} record={record} />
				))}
			</div>
		);
	}
};

export default TransactionManagements;
