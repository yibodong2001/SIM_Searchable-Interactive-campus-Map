import { DecorateContext, Decorator } from "@itwin/core-frontend";
import { BuildingMarker } from "./Marker";
import { Point3d } from "@itwin/core-geometry";
import { convertToCoordinateSystem, Coordinates } from "./XYcalculator";

import BuildingsName from "./data/BuildingsName.json";

import { emitClickEvent } from "./events";

export let clickedMarkerBuildingId = "";
export const clickMarker = async (buildingId: string) => {
  clickedMarkerBuildingId = buildingId;
  await new Promise<void>((resolve) => {
    resolve();
  });
  emitClickEvent();
};

export interface JsonType {
  [key: string]: string;
}

const building_name: JsonType = BuildingsName;

export class BuildingDecorator implements Decorator {
  private _marker: BuildingMarker[] = [];

  public decorate = (context: DecorateContext) => {
    if (context.viewport.view.isSpatialView()) {
      this._marker.forEach((marker) => marker.addDecoration(context));
    }
  };

  private _createMarker = (
    pointLatitude: number,
    pointLongtitude: number,
    originLatitude: number,
    originLongtitude: number,
    building_id: string,
    image: HTMLImageElement
  ) => {
    const _onMouseButtonCallback = () => {
      clickMarker(building_id);
      console.log(building_id);
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
        building_name[building_id], //marker title
        _onMouseButtonCallback,

        Point3d.create(
          convertToCoordinateSystem(origin, points).x,
          convertToCoordinateSystem(origin, points).y,
          0
        ),

        building_name[building_id]
      )
    );
  };

  constructor(
    coordinates: JsonType,
    originLatitude: number,
    originLongtitude: number,
    image: HTMLImageElement
  ) {
    Object.entries(coordinates).forEach(([key, value]) => {
      this._createMarker(
        parseFloat(value.split(",")[0]),
        parseFloat(value.split(",")[1]),
        originLatitude,
        originLongtitude,
        key,
        image
      );
    });
  }
}
