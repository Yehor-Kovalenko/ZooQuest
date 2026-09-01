export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface PixelPoint {
  x: number;
  y: number;
}

export interface ControlPoint {
  geo: GeoPoint;
  pixel: PixelPoint;
}

export interface GeoTransformer {
  gpsToPixel(geo: GeoPoint): PixelPoint;
  pixelToGps(pixel: PixelPoint): GeoPoint;
  accuracyRadiusPx(accuracyMeters: number): number;
  
  // diagnostics
  _getControlPointErrors(points: any[]): number[];
  _getRmsError(points: any[]): number;
}

export interface LocalPoint {
  east: number;
  north: number;
}

export interface AffineMatrix {
  // pixelX = a * east + b * north + tx
  // pixelY = c * east + d * north + ty
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

export const EARTH_RADIUS = 6_378_137;