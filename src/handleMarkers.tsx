import { IModelApp } from "@itwin/core-frontend";
import { imageElementFromUrl } from "@itwin/core-frontend";
import { BuildingDecorator } from "./Decorator";
import { IModelConnection } from "@itwin/core-frontend";
import { CoordinateType } from "./types";

// Promise to load the marker image from a URL
const markerImagePromise = imageElementFromUrl(
  "https://upload.wikimedia.org/wikipedia/commons/e/ed/Map_pin_icon.svg"
);

export const handleMarker = async (
  iModel: IModelConnection,
  coordinates: CoordinateType,
  filteredAddressesArray: string[]
) => {
  // Filtering the building coordinates based on the provided addresses
  const filteredBuildingCoordinates: CoordinateType = Object.fromEntries(
    Object.entries(coordinates).filter(([key]) =>
      filteredAddressesArray.includes(key)
    )
  );

  // Creating a BuildingDecorator with the filtered coordinates and marker image
  const buildingDecorator = new BuildingDecorator(
    filteredBuildingCoordinates,
    iModel.ecefLocation!.cartographicOrigin!.latitudeDegrees,
    iModel.ecefLocation!.cartographicOrigin!.longitudeDegrees,
    await markerImagePromise
  );

  // Removing any existing decorators and adding the new building decorator
  IModelApp.viewManager.decorators.pop();
  IModelApp.viewManager.addDecorator(buildingDecorator);
};
