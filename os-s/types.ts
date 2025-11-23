
export enum ToolType {
  BRUSH = 'BRUSH',
  SMOOTH = 'SMOOTH',
  FLATTEN = 'FLATTEN',
  PINCH = 'PINCH',
  PAINT = 'PAINT'
}

export interface BrushSettings {
  radius: number;
  intensity: number;
  wireframe: boolean;
  paintColor: string; // Specific for the Paint tool
  meshColor: string;  // Global tint for the mesh
  material: 'standard' | 'clay' | 'metallic';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
}

export interface AppState {
  tool: ToolType;
  brush: BrushSettings;
}
