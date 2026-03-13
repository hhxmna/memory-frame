export type SlotShape = 'rect' | 'heart';

export type SlotConfig = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  shape?: SlotShape;
};

// Exact Figma frame coordinates (318×415). Photo strip: inner black areas of the three polaroids.
export const partnerSlots: SlotConfig[] = [
  // Photobook strip – shifted left so images cover the black edge
  { id: 'photoStripTop',    x: 145, y: 34.41,  width: 45.81, height: 46.57, rotation: -6.23, shape: 'rect' },
  { id: 'photoStripMiddle', x: 150, y: 85.99,  width: 45.43, height: 46.77, rotation: -6.2,  shape: 'rect' },
  { id: 'photoStripBottom', x: 155, y: 139.32, width: 45.43, height: 46.62, rotation: -7.21, shape: 'rect' },

  // Player screen
  { id: 'musicPlayerScreen', x: 230.70, y: 142.71, width: 64.05, height: 63.24, rotation: 0.43, shape: 'rect' },

  // Bottom polaroid
  { id: 'bottomPolaroid',    x: 116.32, y: 291.58, width: 75.56, height: 76.36, rotation: -1.04, shape: 'rect' },

  // Locket hearts
  { id: 'locketLeft',        x: 56.00,  y: 159.58, width: 29.14, height: 38.64, rotation: 34.57, shape: 'heart' },
  { id: 'locketRight',       x: 99.00,  y: 156.58, width: 29.14, height: 38.64, rotation: -1.04, shape: 'heart' },
];
