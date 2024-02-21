import { DecorateContext, Decorator } from "@itwin/core-frontend";
import { BuildingMarker } from "./Marker";
import { Point3d } from "@itwin/core-geometry";
import { convertToCoordinateSystem, Coordinates } from "./XYcalculator";
import { emitClickEvent3 } from "./events";
import { CoordinateType } from "./types";

// Variable to store the clicked building address
export let clickedMarkerBuildingAddress = "";

//when click the marker passing the clicked building address to the modul Rooms
export const clickMarker = async (buildingAddress: string) => {
  clickedMarkerBuildingAddress = buildingAddress;
  await new Promise<void>((resolve) => {
    resolve();
  });
  emitClickEvent3();
};

export interface JsonType {
  [key: string]: string;
}

export class BuildingDecorator implements Decorator {
  private _marker: BuildingMarker[] = [];

  public decorate = (context: DecorateContext) => {
    if (context.viewport.view.isSpatialView()) {
      this._marker.forEach((marker) => marker.addDecoration(context));
    }
  };

  // Method to create a marker for each building based on coordinates
  private _createMarker = (
    pointLatitude: number,
    pointLongtitude: number,
    originLatitude: number,
    originLongtitude: number,
    building_address: string,
    image: HTMLImageElement
  ) => {
    // Callback function for mouse button click on the marker
    const _onMouseButtonCallback = () => {
      clickMarker(building_address);
    };

    const origin: Coordinates = {
      latitude: originLatitude,
      longitude: originLongtitude,
    };

    const points: Coordinates = {
      latitude: pointLatitude,
      longitude: pointLongtitude,
    }; //the coordinates of all other building models

    this._marker.push(
      new BuildingMarker(
        image,
        _onMouseButtonCallback,

        Point3d.create(
          convertToCoordinateSystem(origin, points).x,
          convertToCoordinateSystem(origin, points).y,
          0
        )
      )
    );
  };

  constructor(
    coordinates: CoordinateType,
    originLatitude: number,
    originLongtitude: number,
    image: HTMLImageElement
  ) {
    Object.entries(coordinates).forEach(([key, value]) => {
      this._createMarker(
        value[1],
        value[0],
        originLatitude,
        originLongtitude,
        key, //building address
        image //image of the marker
      );
    });
  }
}
