export const SHAPE_PATHS: Record<string, string> = {
  circle: 'M 150 50 Q 80 50 80 125 Q 80 200 150 200 Q 220 200 220 125 Q 220 50 150 50',
  square: 'M 80 60 L 220 60 L 220 200 L 80 200 L 80 60',
  triangle: 'M 150 60 L 80 200 L 220 200 L 150 60',
  rectangle: 'M 60 90 L 240 90 L 240 170 L 60 170 L 60 90',
  diamond: 'M 150 50 L 220 125 L 150 200 L 80 125 L 150 50',
  // star: 'M150 50 L180 140 L260 140 L200 200 L220 280 L150 230 L80 280 L100 200 L40 140 L120 140 Z', // optional 5-point
};

export const getShapePath = (shape: string): string => {
  return SHAPE_PATHS[shape] || SHAPE_PATHS.circle;
};