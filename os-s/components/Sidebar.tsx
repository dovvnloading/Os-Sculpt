import React from 'react';
import { ToolType } from '../types';

interface SidebarProps {
  currentTool: ToolType;
  setTool: (t: ToolType) => void;
  onOpenInfo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTool, setTool, onOpenInfo }) => {
  const tools = [
    { 
      id: ToolType.BRUSH, 
      label: 'Standard', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13.5c0 2.2-2 5-4.5 5.5S9 17 9 17s-2.5 1-2.5-2c0-4.5 9-6 9-6Z"/>
          <path d="M14.5 8.5 9 17"/>
          <path d="M12.5 5 15 2.5 19 6.5 16.5 9"/>
        </svg>
      ) 
    },
    { 
      id: ToolType.SMOOTH, 
      label: 'Smooth', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
        </svg>
      ) 
    },
    { 
      id: ToolType.FLATTEN, 
      label: 'Flatten', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="10" x="4" y="10" rx="2"/>
          <path d="m8 6 4-4 4 4"/>
          <path d="M12 2v8"/>
        </svg>
      ) 
    },
    { 
      id: ToolType.PINCH, 
      label: 'Pinch', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m8 3 4 4 4-4"/>
          <path d="m8 21 4-4 4 4"/>
          <path d="M12 7v10"/>
        </svg>
      ) 
    },
    { 
      id: ToolType.PAINT, 
      label: 'Paint', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.375 2.625a3.875 3.875 0 0 0-5.5 5.5l-9 9a1.875 1.875 0 0 0 2.625 2.625l9-9a3.875 3.875 0 0 0 5.5-5.5Z"/>
          <path d="M14.5 6.5 17.5 9.5"/>
          <path d="m2 22 4-1"/>
        </svg>
      ) 
    },
  ];

  return (
    <div className="w-14 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col items-center py-3 z-20">
      <div className="mb-6">
        <div className="w-8 h-8 bg-orange-700 rounded flex items-center justify-center font-bold text-white text-xs shadow-md">
          OS
        </div>
      </div>
      
      <div className="flex flex-col gap-2 w-full px-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setTool(tool.id)}
            className={`group relative flex items-center justify-center p-2 rounded transition-all duration-100 w-full
              ${currentTool === tool.id 
                ? 'bg-orange-600/20 text-orange-500 border-l-2 border-orange-500' 
                : 'text-neutral-500 hover:bg-[#252525] hover:text-neutral-300 border-l-2 border-transparent'}`}
          >
            {tool.icon}
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 bg-[#111] border border-[#333] text-neutral-300 text-[10px] px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
              {tool.label}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto mb-2">
        <button 
          onClick={onOpenInfo}
          className="w-8 h-8 rounded hover:bg-[#252525] flex items-center justify-center text-neutral-500 hover:text-white transition-colors"
          title="Info & Documentation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <path d="M12 17h.01"/>
          </svg>
        </button>
      </div>
    </div>
  );
};