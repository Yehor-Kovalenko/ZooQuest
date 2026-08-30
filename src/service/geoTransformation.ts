export interface GeoPoint { lat: number; lng: number }
export interface PixelPoint { x: number; y: number }
export interface ControlPoint { geo: GeoPoint; pixel: PixelPoint }

// --- Solve a 3x3 linear system with Cramer's rule ---
function det3x3(m: number[][]): number {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}

function solve3x3(A: number[][], b: number[]): [number, number, number] {
  const detA = det3x3(A);
  if (Math.abs(detA) < 1e-12) {
    throw new Error('Control points are collinear or duplicated — pick 3 non-collinear points.');
  }

  const replaceCol = (col: number) =>
    A.map((row, i) => row.map((v, j) => (j === col ? b[i] : v)));

  const x = det3x3(replaceCol(0)) / detA;
  const y = det3x3(replaceCol(1)) / detA;
  const z = det3x3(replaceCol(2)) / detA;

  return [x, y, z];
}

// --- Compute the affine transform from 3 control points ---
export interface AffineTransform {
  a: number; b: number; c: number; // for pixel x
  d: number; e: number; f: number; // for pixel y
}



// EXPORT
/**
 * Approximate meters per degree of longitude at a given latitude.
 * Longitude degrees shrink in real-world distance as you move away from the equator,
 * because meridians converge toward the poles.
 */
export function metersPerDegreeLng(latDegrees: number): number {
  const latRad = (latDegrees * Math.PI) / 180;
  // WGS84 semi-major axis
  const earthRadiusEquator = 6378137; // meters
  return (Math.PI / 180) * earthRadiusEquator * Math.cos(latRad);
}

export function computeAffineTransform(points: [ControlPoint, ControlPoint, ControlPoint]): AffineTransform {
  const A = points.map(p => [p.geo.lng, p.geo.lat, 1]);
  const X = points.map(p => p.pixel.x);
  const Y = points.map(p => p.pixel.y);

  const [a, b, c] = solve3x3(A, X);
  const [d, e, f] = solve3x3(A, Y);

  return { a, b, c, d, e, f };
}

export function gpsToPixel(transform: AffineTransform, lat: number, lng: number): PixelPoint {
  const { a, b, c, d, e, f } = transform;
  return {
    x: a * lng + b * lat + c,
    y: d * lng + e * lat + f,
  };
}