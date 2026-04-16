import React from 'react';
import { GraduationCap } from 'lucide-react';

export const Logo = ({ className = '', containerClassName = '', variant = 'default' }) => {
  const isWhite = variant === 'white';
  
  // Official Saylani blue color
  const saylaniBlue = '#1273b0';
  const primaryColor = isWhite ? '#ffffff' : saylaniBlue;
  const secondaryColor = '#8DC63F';

  return (
    <div className={`flex flex-col items-center justify-center select-none ${containerClassName}`}>
      <div className={`flex items-end leading-none translate-x-1 ${className}`}>
        <div className="relative">
          <GraduationCap 
            fill={primaryColor} 
            strokeWidth={1} 
            className={`w-6 h-6 md:w-8 md:h-8 ${isWhite ? 'text-white' : 'text-white'} absolute -top-3 md:-top-4 -left-2 -rotate-12 z-10`} 
          />
          <span className="text-3xl md:text-[40px] font-black tracking-tighter" style={{ fontFamily: 'Arial, sans-serif', color: primaryColor }}>SM</span>
        </div>
        <div className="flex flex-col items-center pb-[2px] md:pb-1 mx-[1px]">
          <div style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#8DC63F', marginBottom: '4px' }}></div>
          <span className="text-3xl md:text-[40px] font-black tracking-tighter leading-none" style={{ fontFamily: 'Arial, sans-serif', color: primaryColor }}>I</span>
        </div>
        <span className="text-3xl md:text-[40px] font-black tracking-tighter" style={{ fontFamily: 'Arial, sans-serif', color: primaryColor }}>T</span>
      </div>
      <span className="text-[5px] md:text-[6.5px] font-extrabold text-[#8DC63F] tracking-[0.15em] ml-2 mt-0.5 uppercase">Saylani Mass IT Training</span>
    </div>
  );
};
