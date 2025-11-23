import React from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#1e1e1e] border border-[#333] shadow-2xl rounded-lg flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] bg-[#252525]">
          <div>
            <h2 className="text-lg font-bold text-neutral-200 tracking-wide">Os-s Documentation</h2>
            <p className="text-[10px] text-orange-500 uppercase tracking-widest font-medium">Open Source Sculpt</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-white hover:bg-[#333] rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8 text-sm text-neutral-400 leading-relaxed custom-scrollbar">
          
          {/* Developer Section */}
          <section className="bg-[#151515] p-4 rounded border border-[#2a2a2a]">
            <div className="flex flex-col gap-2">
              <h3 className="text-neutral-200 font-bold">About the Project</h3>
              <p>
                Os-s is a professional-grade web-based sculpting application designed for quick concepting and mesh manipulation.
              </p>
              <div className="mt-2 pt-3 border-t border-[#2a2a2a] flex flex-col gap-1">
                <div className="flex justify-between">
                    <span>Developer:</span>
                    <span className="text-neutral-200">Matthew Robert Wesney</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Repository:</span>
                    <a 
                        href="https://github.com/dovvnloading/Os-Sculpt" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-400 hover:underline flex items-center gap-1"
                    >
                        github.com/dovvnloading/Os-Sculpt
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                    </a>
                </div>
              </div>
            </div>
          </section>

          {/* Documentation Section */}
          <div className="space-y-6">
            
            <section>
              <h3 className="text-white font-bold text-base mb-3 border-b border-[#333] pb-2">Navigation & Controls</h3>
              <ul className="grid grid-cols-1 gap-3">
                <li className="flex items-start gap-3">
                    <span className="bg-[#2a2a2a] text-neutral-200 px-2 py-1 rounded text-xs font-mono min-w-[80px] text-center border border-[#333]">LMB Drag</span>
                    <span>Sculpt on mesh / Rotate camera (on background).</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="bg-[#2a2a2a] text-neutral-200 px-2 py-1 rounded text-xs font-mono min-w-[80px] text-center border border-[#333]">RMB Drag</span>
                    <span>Pan the camera view.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="bg-[#2a2a2a] text-neutral-200 px-2 py-1 rounded text-xs font-mono min-w-[80px] text-center border border-[#333]">Scroll</span>
                    <span>Zoom in / out.</span>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-white font-bold text-base mb-3 border-b border-[#333] pb-2">Tools</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1a1a1a] p-3 rounded border border-[#2a2a2a]">
                    <div className="text-orange-500 font-bold mb-1">Standard</div>
                    <p className="text-xs">Adds volume to the mesh along the surface normals. Good for building up basic forms.</p>
                </div>
                <div className="bg-[#1a1a1a] p-3 rounded border border-[#2a2a2a]">
                    <div className="text-green-400 font-bold mb-1">Smooth</div>
                    <p className="text-xs">Averages vertex positions to relax the mesh and remove noise.</p>
                </div>
                <div className="bg-[#1a1a1a] p-3 rounded border border-[#2a2a2a]">
                    <div className="text-red-400 font-bold mb-1">Flatten</div>
                    <p className="text-xs">Pushes vertices towards the average plane of the brush area. Used for hard-surface edges.</p>
                </div>
                <div className="bg-[#1a1a1a] p-3 rounded border border-[#2a2a2a]">
                    <div className="text-purple-400 font-bold mb-1">Pinch</div>
                    <p className="text-xs">Pulls vertices towards the center of the brush. Useful for sharpening creases.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-white font-bold text-base mb-3 border-b border-[#333] pb-2">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-[#222] py-1">
                    <span>Undo</span>
                    <span className="text-neutral-300">Ctrl + Z</span>
                </div>
                <div className="flex justify-between border-b border-[#222] py-1">
                    <span>Redo</span>
                    <span className="text-neutral-300">Ctrl + Shift + Z</span>
                </div>
                 <div className="flex justify-between border-b border-[#222] py-1">
                    <span>Redo (Alt)</span>
                    <span className="text-neutral-300">Ctrl + Y</span>
                </div>
              </div>
            </section>
          
          </div>

        </div>
      </div>
    </div>
  );
};