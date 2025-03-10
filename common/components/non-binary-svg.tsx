import React from "react";

interface NonBinaryIconProps {
  size?: number; // Size of the icon (width and height)
  className?: string; // Additional CSS classes
}

const NonBinarySvg: React.FC<NonBinaryIconProps> = ({ size = 24, className }) => {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="M12 2l10 10" />
      <path d="M12 22l10-10" />
    </svg>
  );
};

export default NonBinarySvg;