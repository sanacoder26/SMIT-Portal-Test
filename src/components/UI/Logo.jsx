import React from 'react';
import { GraduationCap } from 'lucide-react';

export const Logo = ({ className = '', containerClassName = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${containerClassName}`}>
      <div className={`flex items-end leading-none translate-x-1 ${className}`}>
        <div className="relative">
          <GraduationCap fill="#4B9CD3" strokeWidth={1} className="w-6 h-6 md:w-8 md:h-8 text-white absolute -top-3 md:-top-4 -left-2 -rotate-12 z-10 drop-shadow-sm" />
          <span className="text-3xl md:text-[40px] font-black text-[#1e3a8a] tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>SM</span>
        </div>
        <div className="flex flex-col items-center pb-[2px] md:pb-1 mx-[1px]">
          <div className="w-[6px] h-[6px] md:w-[8px] md:h-[8px] rounded-full bg-[#8DC63F] mb-[2px] md:mb-[4px] shadow-sm"></div>
          <span className="text-3xl md:text-[40px] font-black text-[#1e3a8a] tracking-tighter leading-none" style={{ fontFamily: 'Arial, sans-serif' }}>I</span>
        </div>
        <span className="text-3xl md:text-[40px] font-black text-[#1e3a8a] tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>T</span>
      </div>
      <span className="text-[5px] md:text-[6.5px] font-extrabold text-[#8DC63F] tracking-[0.15em] ml-2 mt-0.5 uppercase">Saylani Mass IT Training</span>
    </div>
  );
};
