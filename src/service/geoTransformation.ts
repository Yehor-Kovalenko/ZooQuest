/*
GPS lat/lng
   ↓
local East/North meters
   ↓
least-squares affine transform
   ↓
image pixel x/y
   ↓
Leaflet [y, x]
*/

import { control } from "leaflet";
import { EARTH_RADIUS, type AffineMatrix, type ControlPoint, type GeoPoint, type GeoTransformer, type LocalPoint, type PixelPoint } from "./i_geoTransformation";

function degreesToRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

function localMeters(
  geo: GeoPoint,
  origin: GeoPoint,
): LocalPoint {
  const lat0 = degreesToRadians(origin.lat);

  const dLat = degreesToRadians(
    geo.lat - origin.lat,
  );

  const dLng = degreesToRadians(
    geo.lng - origin.lng,
  );

  return {
    east: dLng * EARTH_RADIUS * Math.cos(lat0),
    north: dLat * EARTH_RADIUS,
  };
}

function localToGps(
  local: LocalPoint,
  origin: GeoPoint,
): GeoPoint {
  const lat0 = degreesToRadians(origin.lat);
  const dLat = local.north / EARTH_RADIUS;
  const dLng =
    local.east /
    (EARTH_RADIUS * Math.cos(lat0));

  return {
    lat:
      origin.lat +
      dLat * 180 / Math.PI,
    lng:
      origin.lng +
      dLng * 180 / Math.PI,
  };
}

function solve3x3(
  A: number[][],
  b: number[],
): [number, number, number] {
  const m = A.map((row, i) => [
    ...row,
    b[i],
  ]);

  for (let col = 0; col < 3; col++) {
    let pivot = col;

    for (
      let row = col + 1;
      row < 3;
      row++
    ) {
      if (
        Math.abs(m[row][col]) >
        Math.abs(m[pivot][col])
      ) {
        pivot = row;
      }
    }

    if (
      Math.abs(m[pivot][col]) <
      1e-12
    ) {
      throw new Error(
        "Control points do not provide a stable affine transformation.",
      );
    }

    [
      m[col],
      m[pivot],
    ] = [
      m[pivot],
      m[col],
    ];

    for (
      let row = col + 1;
      row < 3;
      row++
    ) {
      const factor =
        m[row][col] /
        m[col][col];

      for (
        let j = col;
        j < 4;
        j++
      ) {
        m[row][j] -=
          factor * m[col][j];
      }
    }
  }

  const result = [0, 0, 0];

  for (
    let row = 2;
    row >= 0;
    row--
  ) {
    let value = m[row][3];

    for (
      let col = row + 1;
      col < 3;
      col++
    ) {
      value -=
        m[row][col] *
        result[col];
    }

    result[row] =
      value /
      m[row][row];
  }

  return result as [
    number,
    number,
    number,
  ];
}

function fitAffine(
  points: Array<{
    local: LocalPoint;
    pixel: PixelPoint;
  }>,
): AffineMatrix {
  if (points.length < 3) {
    throw new Error(
      "At least 3 control points are required.",
    );
  }

  let xx = 0;
  let xy = 0;
  let x1 = 0;

  let yy = 0;
  let y1 = 0;

  let bx = 0;
  let by = 0;
  let cx = 0;
  let cy = 0;

  let sumPixelX = 0;
  let sumPixelY = 0;

  const n = points.length;

  for (const point of points) {
    const east = point.local.east;
    const north = point.local.north;

    xx += east * east;
    xy += east * north;
    x1 += east;

    yy += north * north;
    y1 += north;

    bx += point.pixel.x * east;
    by += point.pixel.x * north;

    cx += point.pixel.y * east;
    cy += point.pixel.y * north;

    sumPixelX += point.pixel.x;
    sumPixelY += point.pixel.y;
  }

  const normalMatrix = [
    [xx, xy, x1],
    [xy, yy, y1],
    [x1, y1, n],
  ];

  const [
    a,
    b,
    tx,
  ] = solve3x3(
    normalMatrix,
    [
      bx,
      by,
      sumPixelX,
    ],
  );

  const [
    c,
    d,
    ty,
  ] = solve3x3(
    normalMatrix,
    [
      cx,
      cy,
      sumPixelY,
    ],
  );

  return {
    a,
    b,
    c,
    d,
    tx,
    ty,
  };
}

function invertAffine(
  matrix: AffineMatrix,
): AffineMatrix {
  const {
    a,
    b,
    c,
    d,
    tx,
    ty,
  } = matrix;

  const determinant =
    a * d - b * c;

  if (
    Math.abs(determinant) <
    1e-12
  ) {
    throw new Error(
      "Affine transformation is singular and cannot be inverted.",
    );
  }

  const inverseA =
    d / determinant;

  const inverseB =
    -b / determinant;

  const inverseC =
    -c / determinant;

  const inverseD =
    a / determinant;

  return {
    a: inverseA,
    b: inverseB,
    c: inverseC,
    d: inverseD,

    tx:
      -(
        inverseA * tx +
        inverseB * ty
      ),

    ty:
      -(
        inverseC * tx +
        inverseD * ty
      ),
  };
}

/**
 * Returns the maximum pixel displacement caused by
 * a one-meter displacement in any horizontal direction.
 *
 * The affine linear component is:
 *
 *        [ a  b ]
 * M =    [ c  d ]
 *
 * For a unit vector u:
 *
 *        pixel displacement = M * u
 *
 * The maximum possible length is the largest singular
 * value of M.
 */
function maximumPixelsPerMeter(
  matrix: AffineMatrix,
): number {
  const {
    a,
    b,
    c,
    d,
  } = matrix;

  /*
   * MᵀM =
   *
   * [ a²+c²    ab+cd ]
   * [ ab+cd    b²+d² ]
   */

  const m00 =
    a * a + c * c;

  const m01 =
    a * b + c * d;

  const m11 =
    b * b + d * d;

  /*
   * Largest eigenvalue of the
   * symmetric 2x2 matrix MᵀM.
   */

  const trace =
    m00 + m11;

  const discriminant =
    Math.sqrt(
      Math.pow(m00 - m11, 2) +
      4 * m01 * m01,
    );

  const largestEigenvalue =
    (trace + discriminant) / 2;

  return Math.sqrt(
    largestEigenvalue,
  );
}

function getOrigin( controlPoints: ControlPoint[], ): GeoPoint { 
  return { 
    lat: controlPoints.reduce( (sum, point) => sum + point.geo.lat, 0, ) / controlPoints.length, 
    lng: controlPoints.reduce( (sum, point) => sum + point.geo.lng, 0, ) / controlPoints.length, 
  }; 
}

///////
/** *
     * Calculate pixel-space errors for every control point. * 
     * * The returned value at index i is the Euclidean pixel 
     * * distance between: 
     * * * - the actual control-point pixel 
     * * - the pixel predicted by the least-squares affine transform 
     * * * Example: * * const errors = _getControlPointErrors(controlPoints); * * // [0.42, 1.13, 0.87, ...] 
     * */ 
function getControlPointErrors(controlPoints: any[]): number[] { 
  if (controlPoints.length < 4) { 
    throw new Error( "At least 4 control points are required.", ); 
  } 
  const origin = getOrigin(controlPoints); 
  const localPoints = controlPoints.map(point => ({ local: localMeters( point.geo, origin, ), pixel: point.pixel, })); 
  const affine = fitAffine(localPoints); 
  return localPoints.map( point => { 
    const predictedX = affine.a * point.local.east + affine.b * point.local.north + affine.tx; 
    const predictedY = affine.c * point.local.east + affine.d * point.local.north + affine.ty; 
    const errorX = predictedX - point.pixel.x; 
    const errorY = predictedY - point.pixel.y;
    return Math.sqrt( errorX * errorX + errorY * errorY, ); }, 
  );
}
////////
/** 
* * Calculate the RMS pixel error of all control points. 
* * * RMS = sqrt( * sum(error_i²) / number_of_points * ) 
* */
function getRmsError(controlPoints: any[]): number { 
  const errors = getControlPointErrors(controlPoints); 
  if (errors.length === 0) { 
    return 0; 
  } 
  const sumSquaredErrors = errors.reduce( 
    (sum, error) => sum + error * error, 0, 
  ); 
  return Math.sqrt( sumSquaredErrors / errors.length, ); 
}

/**
 * Create a GPS <-> image-pixel transformer.
 *
 * Image coordinate convention:
 *
 *        x →
 *   (0,0)
 *      |
 *      |
 *      ↓ y
 *
 * The image is NOT rotated or modified.
 * Rotation, scale and translation are learned
 * from the control points.
 */
export function createGeoTransformer(
  controlPoints: ControlPoint[],
): GeoTransformer {
  if (controlPoints.length < 4) {
    throw new Error(
      "At least 4 control points are required.",
    );
  }

  /*
   * Average control-point position becomes
   * the local coordinate origin.
   */
  const origin: GeoPoint = {
    lat:
      controlPoints.reduce(
        (sum, point) =>
          sum + point.geo.lat,
        0,
      ) /
      controlPoints.length,

    lng:
      controlPoints.reduce(
        (sum, point) =>
          sum + point.geo.lng,
        0,
      ) /
      controlPoints.length,
  };

  const localPoints =
    controlPoints.map(point => ({
      local: localMeters(
        point.geo,
        origin,
      ),
      pixel: point.pixel,
    }));

  const forward =
    fitAffine(localPoints);

  const inverse =
    invertAffine(forward);

  /*
   * This is constant over the small map area
   * because the affine transformation operates
   * in local meters.
   */
  const pixelsPerMeter =
    maximumPixelsPerMeter(
      forward,
    );

  return {
    gpsToPixel(
      geo: GeoPoint,
    ): PixelPoint {
      const local =
        localMeters(
          geo,
          origin,
        );

      return {
        x:
          forward.a *
            local.east +
          forward.b *
            local.north +
          forward.tx,

        y:
          forward.c *
            local.east +
          forward.d *
            local.north +
          forward.ty,
      };
    },

    pixelToGps(
      pixel: PixelPoint,
    ): GeoPoint {
      const east =
        inverse.a *
          pixel.x +
        inverse.b *
          pixel.y +
        inverse.tx;

      const north =
        inverse.c *
          pixel.x +
        inverse.d *
          pixel.y +
        inverse.ty;

      return localToGps(
        {
          east,
          north,
        },
        origin,
      );
    },

    accuracyRadiusPx(
      accuracyMeters: number,
    ): number {
      if (
        !Number.isFinite(
          accuracyMeters,
        ) ||
        accuracyMeters < 0
      ) {
        return 0;
      }

      return (
        accuracyMeters *
        pixelsPerMeter
      );
    },
    
    _getRmsError(controlPoints: any[]): number {
      return getRmsError(controlPoints);
    },

    _getControlPointErrors(controlPoints: any[]): number[] {
      return getControlPointErrors(controlPoints);
    }
  };
}

export { ControlPoint };
