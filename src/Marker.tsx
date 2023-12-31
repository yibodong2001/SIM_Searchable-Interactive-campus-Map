import { Marker } from "@itwin/core-frontend";
import { Point2d, Point3d, XAndY } from "@itwin/core-geometry";
import { BeButton, BeButtonEvent } from "@itwin/core-frontend";

export class BuildingMarker extends Marker {
  private static _height = 35;
  private _onMouseButtonCallback: any;
  constructor(
    image: HTMLImageElement,
    title: string,
    onMouseButtonCallback: any,
    worldLocation: Point3d,
    buildingName: string
  ) {
    super(
      worldLocation,
      new Point2d(
        image.width * (BuildingMarker._height / image.height),
        BuildingMarker._height
      )
    );
    this._onMouseButtonCallback = onMouseButtonCallback;
    this.title = title;
    this.setImage(image);
    this.label = buildingName;
    this.labelColor = "black";
  }
  public onMouseButton(ev: BeButtonEvent): boolean {
    if (
      BeButton.Data !== ev.button ||
      !ev.isDown ||
      !ev.viewport ||
      !ev.viewport.view.isSpatialView()
    )
      return true;

    this._onMouseButtonCallback();
    return true;
  }
}
