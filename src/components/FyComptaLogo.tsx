import React from 'react';

interface FyComptaLogoProps {
  className?: string;
  size?: number | string;
}

export const FyComptaLogo: React.FC<FyComptaLogoProps> = ({ 
  className = '', 
  size = 40 
}) => {
  return (
    <svg 
      id="fycompta-corporate-logo"
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
    >
      {/* Background shape wrapper / Glow effect can be styling, or clean background */}
      
      {/* Stylized White Letter "F" */}
      <path 
        d="M20 15H75V27H35V42H65V54H35V60L20 75V15Z" 
        fill="#FFFFFF" 
      />
      
      {/* Rising Bar Chart (3 electric blue bars) nested at bottom-left of F stem */}
      {/* Bar 1 */}
      <rect 
        x="23" 
        y="75" 
        width="4" 
        height="10" 
        rx="1"
        fill="#1e70ff" 
      />
      {/* Bar 2 */}
      <rect 
        x="30" 
        y="67" 
        width="4" 
        height="18" 
        rx="1"
        fill="#2678ff" 
      />
      {/* Bar 3 */}
      <rect 
        x="37" 
        y="58" 
        width="4" 
        height="27" 
        rx="1"
        fill="#3b82f6" 
      />
      
      {/* Dynamic Electric Blue Stylized Letter "C" */}
      <path 
        d="M78 40C60 40 45 49 45 62.5C45 76 60 85 78 85V73C65 73 57.5 69 57.5 62.5C57.5 56 65 52 78 52V40Z" 
        fill="#3b82f6" 
      />
    </svg>
  );
};
