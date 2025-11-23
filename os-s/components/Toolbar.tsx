import React from 'react';

interface ToolbarProps {}

export const Toolbar: React.FC<ToolbarProps> = () => {
  
  const handleUndo = () => {
    window.dispatchEvent(new Event('sculpt-undo'));
  };

  const handleRedo = () => {
    window.dispatchEvent(new Event('sculpt-redo'));
  };

  const handleExport = () => {
    window.dispatchEvent(new Event('sculpt-export'));
  };

  return (
    <div className="h-10 bg-[#1e1e1e] border-b border-[#2a2a2a] flex items-center justify-between px-3 z-30 select-none">
      {/* Left Menu */}
      <div className="flex items-center gap-1">
      </div>

      {/* Center Info - Project Name */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4">
         <div className="flex items-center gap-1">
             <button 
                onClick={handleUndo}
                className="p-1.5 text-neutral-500 hover:text-white hover:bg-[#333] rounded group relative"
                title="Undo (Ctrl+Z)"
             >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
             </button>
             <button 
                onClick={handleRedo}
                className="p-1.5 text-neutral-500 hover:text-white hover:bg-[#333] rounded group relative"
                title="Redo (Ctrl+Shift+Z)"
             >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
             </button>
         </div>
         <div className="h-4 w-[1px] bg-[#333]"></div>
         <span className="text-neutral-500 text-[11px] font-medium tracking-wide">Untitled_Sphere_001</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button 
            onClick={handleExport}
            className="w-7 h-7 rounded bg-orange-700 text-[10px] font-bold text-white flex items-center justify-center hover:bg-orange-600 transition-colors shadow-sm"
            title="Export to .OBJ"
        >
          EXP
        </button>
      </div>
    </div>
  );
};