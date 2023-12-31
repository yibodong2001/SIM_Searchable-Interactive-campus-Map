import * as geolib from "geolib";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// 计算两点之间的距离
function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  return geolib.getDistance(point1, point2);
}

// 将经纬度转换为在原点建立坐标轴的坐标
export function convertToCoordinateSystem(
  origin: Coordinates,
  point: Coordinates
): { x: number; y: number } {
  // 计算两点之间的距离和方向
  const distance = calculateDistance(origin, point);
  const bearing = geolib.getRhumbLineBearing(origin, point);

  // 将方向转换为角度
  const angle = (450 - bearing) % 360; // 将方向转为角度，0 度为正北

  // 计算在坐标系中的坐标
  const y = distance * Math.sin(angle * (Math.PI / 180)); // 正东为正方向
  const x = distance * Math.cos(angle * (Math.PI / 180)); // 正北为正方向

  return { x, y };
}
