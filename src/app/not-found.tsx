"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
			<div className="max-w-md w-full space-y-8 text-center">
				<Image
					src="/assets/not-found.webp"
					alt="Page Not Found"
					width={300}
					height={300}
					className="mx-auto"
				/>
				<h1 className="text-4xl font-bold text-gray-800">
					Oops! Page Not Found
				</h1>
				<p className="text-gray-600 text-lg">
					The page you are looking for might have been removed, had its name
					changed, or is temporarily unavailable.
				</p>
				<div className="flex justify-center space-x-4">
					<div
						onClick={() => router.back()}
						className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
					>
						Go Back
					</div>

					<Link
						href="/"
						className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
					>
						Go to Home
					</Link>

					<Link
						href="/dashboard/main-store"
						className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
					>
						Go to Main Store
					</Link>
				</div>
			</div>
		</div>
	);
}
