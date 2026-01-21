import { POINT_TOLERANCE, SAMPLE_INTERVAL } from '../constants/Alphabet';

interface Point {
  x: number;
  y: number;
}

export const parseSVGPath = (pathData: string): Point[] => {
  const points: Point[] = [];
  const commands = pathData.match(/[MLQC][^MLQC]*/g) || [];
  
  let currentX = 0;
  let currentY = 0;

  commands.forEach(cmd => {
    const type = cmd[0];
    const coords = cmd.slice(1).trim().split(/[\s,]+/).map(Number);

    if (type === 'M' || type === 'L') {
      currentX = coords[0];
      currentY = coords[1];
      points.push({ x: currentX, y: currentY });
    } else if (type === 'Q') {
      const [cx, cy, x, y] = coords;
      for (let t = 0; t <= 1; t += 0.1) {
        const qt = 1 - t;
        const qx = qt * qt * currentX + 2 * qt * t * cx + t * t * x;
        const qy = qt * qt * currentY + 2 * qt * t * cy + t * t * y;
        points.push({ x: qx, y: qy });
      }
      currentX = x;
      currentY = y;
    }
  });

  return samplePoints(points, SAMPLE_INTERVAL);
};

const samplePoints = (points: Point[], interval: number): Point[] => {
  if (points.length < 2) return points;
  
  const sampled: Point[] = [points[0]];
  let accumulated = 0;

  for (let i = 1; i < points.length; i++) {
    const dist = distance(points[i - 1], points[i]);
    accumulated += dist;

    if (accumulated >= interval) {
      sampled.push(points[i]);
      accumulated = 0;
    }
  }

  sampled.push(points[points.length - 1]);
  return sampled;
};

const distance = (p1: Point, p2: Point): number => {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
};

export const validateTracing = (
  userPoints: Point[],
  letterPoints: Point[]
): number => {
  if (userPoints.length === 0 || letterPoints.length === 0) return 0;

  let matches = 0;

  userPoints.forEach(userPoint => {
    const hasMatch = letterPoints.some(
      letterPoint => distance(userPoint, letterPoint) <= POINT_TOLERANCE
    );
    if (hasMatch) matches++;
  });

  return matches / userPoints.length;
};
