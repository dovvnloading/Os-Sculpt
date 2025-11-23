
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { SculptCanvas } from './components/SculptCanvas';
import { Toolbar } from './components/Toolbar';
import { InfoModal } from './components/InfoModal';
import { ToolType, BrushSettings } from './types';

const App: React.FC = () => {
  const [tool, setTool] = useState<ToolType>(ToolType.BRUSH);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [brush, setBrush] = useState<BrushSettings>({
    radius: 0.5,
    intensity: 1.0,
    wireframe: false,
    paintColor: '#ef4444', // Default red for painting so it's visible
    meshColor: '#ffffff',  // Default white so vertex colors show true
    material: 'standard'
  });

  return (
    <div className="flex flex-col w-screen h-screen bg-black text-white overflow-hidden">
      {/* Top Navigation */}
      <Toolbar />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Tools (Left) */}
        <Sidebar currentTool={tool} setTool={setTool} onOpenInfo={() => setIsInfoOpen(true)} />

        {/* Main 3D Viewport (Center) */}
        <div className="flex-1 relative bg-[#0a0a0a] shadow-inner">
          <SculptCanvas tool={tool} brush={brush} />
        </div>

        {/* Properties (Right) */}
        <PropertiesPanel brush={brush} setBrush={setBrush} />
      </div>

      {/* Overlays */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
};

export default App;
