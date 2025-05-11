"use client";

import { ScaleLoader } from "react-spinners";

const ButtonLoader = ({
  height,
  width,
  radius,
}: {
  height?: number;
  width?: number;
  radius?: number;
}) => {
  return (
    <div className="flex items-center justify-center">
      <ScaleLoader
        height={height || 16}
        width={width || 2}
        radius={radius || 1}
        margin={1}
        color="var(--accent)"
      />
    </div>
  );
};

export default ButtonLoader;
