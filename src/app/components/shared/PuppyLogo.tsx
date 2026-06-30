import React from "react";
import appLogo from "@/assets/images/regenerated_image_1782801979718.png";

interface PuppyLogoProps {
  className?: string;
  size?: number;
}

export const PuppyLogo: React.FC<PuppyLogoProps> = ({ className = "", size = 44 }) => {
  return (
    <div
      className={`flex items-center justify-center relative select-none group ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full flex items-center justify-center transition-all duration-300">
        <img 
          src={appLogo} 
          alt="App Logo" 
          className="w-[42px] h-[42px] object-contain rounded-[40px] border border-solid border-slate-200 transition-transform duration-500 group-hover:scale-110" 
          style={{ 
            imageRendering: '-webkit-optimize-contrast',
            mixBlendMode: 'multiply',
            borderRadius: '40px',
            borderStyle: 'solid',
            paddingLeft: '-4px',
            marginRight: '4px',
            marginLeft: '4px',
            marginTop: '4px',
            marginBottom: '0px',
            paddingBottom: '-6px',
            paddingTop: '-6px',
            paddingRight: '-5px'
          }}
        />
      </div>
    </div>
  );
};
