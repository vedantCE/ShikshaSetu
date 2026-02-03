import { POINT_TOLERANCE, SAMPLE_INTERVAL } from '../constants/Alphabet';

interface Point {
  x: number;
  y: number;
}

// Helper: Calculate distance between two points
const distance = (p1: Point, p2: Point): number => {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
};

// Helper: Linear interpolation between two points
const interpolatePoints = (start: Point, end: Point, interval: number): Point[] => {
  const dist = distance(start, end);
  const steps = Math.ceil(dist / interval);

  if (steps <= 1) return [];

  const points: Point[] = [];
  const dx = (end.x - start.x) / steps;
  const dy = (end.y - start.y) / steps;

  for (let i = 1; i < steps; i++) {
    points.push({
      x: start.x + dx * i,
      y: start.y + dy * i,
    });
  }

  return points;
};

// Helper: Densely sample a path (filling gaps between key points)
const denseSamplePath = (points: Point[], interval: number): Point[] => {
  if (points.length < 2) return points;

  const densePath: Point[] = [points[0]];

  for (let i = 1; i < points.length; i++) {
    const start = points[i - 1];
    const end = points[i];

    // Add interpolated points
    const filler = interpolatePoints(start, end, interval);
    densePath.push(...filler);

    // Add the actual next point
    densePath.push(end);
  }

  return densePath;
};

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
      // Quadratic Bezier interpolation
      for (let t = 0; t <= 1; t += 0.05) { // finer resolution for curves
        const qt = 1 - t;
        const qx = qt * qt * currentX + 2 * qt * t * cx + t * t * x;
        const qy = qt * qt * currentY + 2 * qt * t * cy + t * t * y;
        points.push({ x: qx, y: qy });
      }
      currentX = x;
      currentY = y;
    }
  });

  // CRITICAL: Densely sample the letter path so we have targets every ~5px
  return denseSamplePath(points, SAMPLE_INTERVAL);
};


export const validateTracing = (
  userPoints: Point[],
  letterPoints: Point[]
): number => {
  if (userPoints.length < 2 || letterPoints.length === 0) return 0;

  // 1. Densely sample USER path (to fill gaps from fast swipes)
  const denseUserPoints = denseSamplePath(userPoints, SAMPLE_INTERVAL);

  // 2. Coverage Calculation: Check how many LETTER points are "covered" by the user
  let coveredPoints = 0;

  letterPoints.forEach(targetPoint => {
    // Is this target point close to ANY user point?
    const isCovered = denseUserPoints.some(
      userPoint => distance(userPoint, targetPoint) <= POINT_TOLERANCE
    );

    if (isCovered) {
      coveredPoints++;
    }
  });

  // Score = Percentage of letter points covered
  return coveredPoints / letterPoints.length;
};