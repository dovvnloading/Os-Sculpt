
import React from 'react';
import { BrushSettings } from '../types';

interface PropertiesPanelProps {
  brush: BrushSettings;
  setBrush: React.Dispatch<React.SetStateAction<BrushSettings>>;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ brush, setBrush }) => {
  
  const updateBrush = (key: keyof BrushSettings, value: any) => {
    setBrush(prev => ({ ...prev, [key]: value }));
  };

  const Slider = ({ label, value, min, max, step, onChange }: any) => (
    <div className="flex flex-col gap-1 mb-3">
        <div className="flex justify-between text-[#888] text-[10px] font-medium uppercase tracking-wide">
            <span>{label}</span>
            <span className="text-[#ccc]">{value.toFixed(2)}</span>
        </div>
        <div className="relative w-full h-4 flex items-center">
            <input 
                type="range" 
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#111] rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:rounded-sm hover:[&::-webkit-slider-thumb]:bg-orange-500"
            />
            {/* Custom Track Visual - simplified */}
            <div className="absolute top-1/2 left-0 h-1 bg-[#333] w-full -z-10 rounded-sm overflow-hidden">
                <div 
                    className="h-full bg-[#444]" 
                    style={{ width: `${((value - min) / (max - min)) * 100}%` }} 
                />
            </div>
        </div>
    </div>
  );

  // Preset colors for painting
  const paintColors = [
      '#ef4444', '#f97316', '#eab308', '#22c55e', 
      '#3b82f6', '#a855f7', '#ffffff', '#000000'
  ];

  // Preset colors for material tint
  const meshColors = [
      '#ffffff', // Pure
      '#f5f5f5', // Light Grey
      '#a3a3a3', // Med Grey
      '#ffedd5', // Clay Warm
      '#fee2e2', // Red Tint
      '#dbeafe', // Blue Tint
  ];

  return (
    <div className="w-64 bg-[#1e1e1e] border-l border-[#2a2a2a] flex flex-col h-full select-none z-20">
      {/* Header */}
      <div className="h-8 flex items-center px-3 border-b border-[#2a2a2a] bg-[#252525]">
        <h2 className="text-[11px] font-bold text-neutral-300 uppercase tracking-widest">Tool Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        
        {/* Brush Section */}
        <div>
          <h3 className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-3 border-b border-[#333] pb-1">Brush</h3>
          <Slider 
            label="Radius" 
            value={brush.radius} 
            min={0.1} max={2.0} step={0.05} 
            onChange={(v: number) => updateBrush('radius', v)} 
          />
          <Slider 
            label="Intensity" 
            value={brush.intensity} 
            min={0.1} max={5.0} step={0.1} 
            onChange={(v: number) => updateBrush('intensity', v)} 
          />
        </div>

        {/* Paint Section - NEW */}
        <div>
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3 border-b border-[#333] pb-1">Paint Color</h3>
            <div className="space-y-2">
                <div className="flex gap-1.5 flex-wrap">
                {paintColors.map(color => (
                    <button
                        key={color}
                        onClick={() => updateBrush('paintColor', color)}
                        className={`w-5 h-5 rounded-full border transition-all shadow-sm
                            ${brush.paintColor === color ? 'border-white scale-110 ring-1 ring-white/50' : 'border-transparent opacity-70 hover:opacity-100'}
                        `}
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
                </div>
                <div className="flex items-center gap-2 mt-2 bg-[#151515] p-1 rounded border border-[#333]">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: brush.paintColor }}></div>
                    <span className="text-[9px] text-neutral-400 font-mono uppercase">{brush.paintColor}</span>
                </div>
            </div>
        </div>

        {/* Material Section */}
        <div>
          <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3 border-b border-[#333] pb-1">Material</h3>
          
          <div className="grid grid-cols-3 gap-1 mb-4">
            {['standard', 'clay', 'metallic'].map((mat) => (
              <button
                key={mat}
                onClick={() => updateBrush('material', mat)}
                className={`h-12 border rounded-sm flex flex-col items-center justify-center gap-1 transition-all
                  ${brush.material === mat 
                    ? 'border-orange-600 bg-[#2a2a2a] text-orange-500' 
                    : 'border-[#333] bg-[#1a1a1a] text-neutral-500 hover:border-[#555]'}`}
              >
                 <div className={`w-3 h-3 rounded-full shadow-sm
                    ${mat === 'standard' ? 'bg-neutral-400' : ''}
                    ${mat === 'clay' ? 'bg-orange-800' : ''}
                    ${mat === 'metallic' ? 'bg-slate-300' : ''}
                 `} />
                 <span className="text-[9px] uppercase font-medium">{mat}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-neutral-400">Global Tint</label>
            <div className="flex gap-1.5 flex-wrap">
               {meshColors.map(color => (
                   <button
                    key={color}
                    onClick={() => updateBrush('meshColor', color)}
                    className={`w-5 h-5 rounded-sm border transition-all
                        ${brush.meshColor === color ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'}
                    `}
                    style={{ backgroundColor: color }}
                   />
               ))}
            </div>
          </div>
        </div>
        
        {/* Topology Section */}
        <div>
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3 border-b border-[#333] pb-1">Topology</h3>
            <div className="flex items-center justify-between py-1 hover:bg-[#252525] px-1 rounded cursor-pointer" onClick={() => updateBrush('wireframe', !brush.wireframe)}>
                <span className="text-[11px] text-neutral-400">Wireframe Overlay</span>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${brush.wireframe ? 'bg-orange-700' : 'bg-[#111] border border-[#333]'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-200 ${brush.wireframe ? 'left-4.5' : 'left-0.5'}`} />
                </div>
            </div>
        </div>

      </div>

      {/* Footer Stats */}
      <div className="p-2 bg-[#151515] border-t border-[#2a2a2a]">
          <div className="grid grid-cols-2 gap-y-1 gap-x-4">
            <div className="flex justify-between text-[10px] text-neutral-500">
                <span>Verts</span>
                <span className="text-neutral-300 font-mono">19.6k</span>
            </div>
            <div className="flex justify-between text-[10px] text-neutral-500">
                <span>Tris</span>
                <span className="text-neutral-300 font-mono">39.2k</span>
            </div>
          </div>
      </div>
    </div>
  );
};
