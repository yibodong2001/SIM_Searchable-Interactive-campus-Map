import { Marker } from "@itwin/core-frontend";
import { Point2d, Point3d } from "@itwin/core-geometry";
import { BeButton, BeButtonEvent } from "@itwin/core-frontend";

// BuildingMarker class extending Marker
export class BuildingMarker extends Marker {
  // Static variable for marker height
  private static _height = 35;

  // Callback function to be triggered on mouse button event
  private _onMouseButtonCallback: any;

  // Constructor
  constructor(
    image: HTMLImageElement,
    onMouseButtonCallback: any,
    worldLocation: Point3d
  ) {
    // Calling the constructor of the base class (Marker)
    super(
      worldLocation,
      new Point2d(
        image.width * (BuildingMarker._height / image.height),
        BuildingMarker._height
      )
    );

    // Storing the callback function
    this._onMouseButtonCallback = onMouseButtonCallback;

    // Setting the marker image
    this.setImage(image);

    // Setting label color
    this.labelColor = "black";
  }

  // Overriding the onMouseButton method from the base class
  public onMouseButton(ev: BeButtonEvent): boolean {
    // Checking if the button event is valid for handling
    if (
      BeButton.Data !== ev.button ||
      !ev.isDown ||
      !ev.viewport ||
      !ev.viewport.view.isSpatialView()
    )
      return true;

    // Triggering the stored callback function on mouse button event
    this._onMouseButtonCallback();

    // Returning true to indicate the event has been handled
    return true;
  }
}
