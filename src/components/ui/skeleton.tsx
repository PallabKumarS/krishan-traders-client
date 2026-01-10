import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn(
				"relative overflow-hidden bg-accent rounded-md",
				"before:absolute before:inset-0",
				"before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
				"before:animate-shimmer-wave",
				className,
			)}
			{...props}
		/>
	);
}

// Form-specific skeleton components
function FormSkeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div className={cn("space-y-6 py-6", className)} {...props}>
			{/* Company Name Field */}
			<div className="space-y-2">
				<Skeleton className="h-4 w-24" /> {/* Label */}
				<Skeleton className="h-10 w-full" /> {/* Select input */}
			</div>

			{/* Product Name Field */}
			<div className="space-y-2">
				<Skeleton className="h-4 w-24" /> {/* Label */}
				<Skeleton className="h-10 w-full" /> {/* Select input */}
			</div>

			{/* Stock Size Field */}
			<div className="space-y-2">
				<Skeleton className="h-4 w-20" /> {/* Label */}
				<Skeleton className="h-10 w-full" /> {/* Input */}
			</div>

			{/* Quantity Field */}
			<div className="space-y-2">
				<Skeleton className="h-4 w-16" /> {/* Label */}
				<Skeleton className="h-10 w-full" /> {/* Input */}
			</div>

			{/* Expiry Date Field */}
			<div className="space-y-2">
				<Skeleton className="h-4 w-20" /> {/* Label */}
				<Skeleton className="h-10 w-full" /> {/* Date picker */}
			</div>

			{/* Submit Button */}
			<Skeleton className="h-10 w-full" />
		</div>
	);
}

// Reusable form field skeleton
function FormFieldSkeleton({
	labelWidth = "w-24",
	className,
	...props
}: React.ComponentProps<"div"> & { labelWidth?: string }) {
	return (
		<div className={cn("space-y-2", className)} {...props}>
			<Skeleton className={cn("h-4", labelWidth)} />
			<Skeleton className="h-10 w-full" />
		</div>
	);
}

// Multiple form fields skeleton
function MultipleFormFieldsSkeleton({
	fields = 5,
	className,
	...props
}: React.ComponentProps<"div"> & { fields?: number }) {
	return (
		<div className={cn("space-y-6 py-6", className)} {...props}>
			{Array.from({ length: fields }).map((_, index) => (
				<FormFieldSkeleton key={index} />
			))}
			<Skeleton className="h-10 w-full" /> {/* Submit button */}
		</div>
	);
}

export {
	Skeleton,
	FormSkeleton,
	FormFieldSkeleton,
	MultipleFormFieldsSkeleton,
};
