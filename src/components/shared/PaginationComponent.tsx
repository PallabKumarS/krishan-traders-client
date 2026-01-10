"use client";

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { TMeta } from "@/types";
import { usePathname, useRouter } from "next/navigation";

export function PaginationComponent({ meta }: { meta?: TMeta }) {
	const router = useRouter();
	const pathname = usePathname();

	if (!meta) {
		return (
			<Pagination className="mb-10">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious className="pointer-events-none opacity-50" />
					</PaginationItem>
					<PaginationItem>
						<PaginationLink isActive={true}>1</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext className="pointer-events-none opacity-50" />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		);
	}

	const handlePagination = (page: number) => {
		router.push(`${pathname}?page=${page}`);
	};

	return (
		<Pagination className="mb-10">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() => handlePagination(meta.page - 1)}
						className={meta.page <= 1 ? "pointer-events-none opacity-50" : ""}
					/>
				</PaginationItem>

				{Array(meta.totalPage > 0 ? meta.totalPage : 1)
					.fill("*")
					.map((_, index) => (
						<PaginationItem key={index}>
							<PaginationLink
								isActive={meta.page === index + 1}
								onClick={() => handlePagination(index + 1)}
							>
								{index + 1}
							</PaginationLink>
						</PaginationItem>
					))}

				<PaginationItem>
					<PaginationNext
						onClick={() => handlePagination(meta.page + 1)}
						className={
							meta.page >= meta.totalPage
								? "pointer-events-none opacity-50"
								: ""
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
