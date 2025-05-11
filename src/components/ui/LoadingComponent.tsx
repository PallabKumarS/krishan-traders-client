import React from "react";
import "../../app/spinner.css";

const LoadingComponent = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="bulb-wrapper relative">
        {/* Glow Effect */}
        <div className="glow"></div>

        {/* Bulb */}
        <div className="bulb"></div>

        {/* Rays */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`ray ray-${i}`}></div>
        ))}

        {/* Bulb neck rings */}
        <div className="base"></div>
      </div>
    </div>
  );
};

export default LoadingComponent;
