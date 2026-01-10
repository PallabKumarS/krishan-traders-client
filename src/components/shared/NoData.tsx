"use client";

import { motion } from "framer-motion";
import { FileX2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NoData = ({ message }: { message?: string }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center p-4"
		>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2 }}
			>
				<FileX2 className="h-20 w-20 text-muted-foreground" />
			</motion.div>

			<div className="space-y-2">
				<h2 className="text-2xl font-semibold tracking-tight">No Data Found</h2>
				<p className="text-muted-foreground">
					{message || "We could not find any data to display at the moment"}
				</p>
			</div>

			<Link href="/">
				<Button variant="outline" className="mt-4">
					Go Back Home
				</Button>
			</Link>
		</motion.div>
	);
};

export default NoData;
