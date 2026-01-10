import React from "react";
import "../../app/spinner.css";

const LoadingComponent = () => {
	return (
		<div className="h-screen w-full flex justify-center items-center">
			<div className="leaf-wrapper relative">
				{/* Main Leaf */}
				<div className="leaf"></div>

				{/* Small Leaves */}
				{Array.from({ length: 12 }).map((_, i) => (
					<div key={i} className="small-leaf"></div>
				))}

				{/* Stem */}
				<div className="stem"></div>
			</div>
		</div>
	);
};

export default LoadingComponent;
