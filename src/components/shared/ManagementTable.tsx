/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	ColumnDef,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface ITableProps {
	data: any | undefined;
	columns: ColumnDef<any>[];
}

export function ManagementTable({ data, columns }: ITableProps) {
	const table = useReactTable({
		data: data ?? [],
		columns: columns as ColumnDef<any>[],
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div
			className="w-full"
			style={{
				overscrollBehavior: "contain",
				maxWidth: "100%",
				overflowX: "auto",
			}}
		>
			<Table
				className="w-full"
				style={{
					tableLayout: "auto",
					width: "100%",
				}}
			>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									style={{
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
									}}
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows?.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell
										key={cell.id}
										style={{
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="text-center">
								<p>No data found</p>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
