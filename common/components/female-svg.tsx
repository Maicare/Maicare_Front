import React from "react";

interface FemaleIconProps {
  size?: number; // Size of the icon (width and height)
  className?: string; // Additional CSS classes
}

const FemaleSvg: React.FC<FemaleIconProps> = ({ size = 24, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M12 13v7" />
      <path d="M9 18h6" />
    </svg>
  );
};

export default FemaleSvg;