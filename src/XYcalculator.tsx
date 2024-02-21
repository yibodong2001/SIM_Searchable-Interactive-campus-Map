// Import the geolib library
import * as geolib from "geolib";

// Define a TypeScript interface for representing geographical coordinates
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Function to calculate the distance between two points using geolib
function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  // Use the geolib.getDistance function to calculate the distance in meters
  return geolib.getDistance(point1, point2);
}

// Function to convert geographical coordinates to a custom coordinate system
export function convertToCoordinateSystem(
  origin: Coordinates,
  point: Coordinates
): { x: number; y: number } {
  // Calculate the distance and bearing between the origin and target points
  const distance = calculateDistance(origin, point);
  const bearing = geolib.getRhumbLineBearing(origin, point);

  // Convert the bearing to an angle in the custom coordinate system
  const angle = (450 - bearing) % 360;

  // Calculate the x and y coordinates in the custom coordinate system
  const y = distance * Math.sin(angle * (Math.PI / 180));
  const x = distance * Math.cos(angle * (Math.PI / 180));

  // Return the result as an object with x and y coordinates
  return { x, y };
}
