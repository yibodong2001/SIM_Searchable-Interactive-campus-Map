import {
  ClipPrimitive,
  ClipVector,
  ConvexClipPlaneSet,
  Plane3dByOriginAndUnitNormal,
  Vector3d,
  Point3d,
  ClipPlane,
} from "@itwin/core-geometry";
import { IModelApp, IModelConnection } from "@itwin/core-frontend";
import { useActiveIModelConnection } from "@itwin/appui-react";
import { useState } from "react";
import { setSelectSetType } from "./types";

// LevelCliper component
const LevelCliper = ({ selectSet }: setSelectSetType) => {
  // Accessing the active iModel connection
  const iModelConnection = useActiveIModelConnection() as IModelConnection;

  // State to track the toggle status
  const [toggled, setToggled] = useState<boolean>(true);

  // Function to adjust the room level height and update the view state
  const roomLevelHeight = async (selectSet: string) => {
    try {
      // Accessing the selected view
      const vp = IModelApp.viewManager.selectedView!;
      const viewState = vp.view;

      // Getting the room origin's Z coordinate
      const roomOrigin = await getRoomOrigin(selectSet);
      const roomHeight = roomOrigin.Z;

      // Toggling the visibility based on the current state
      setToggled(!toggled);

      // Creating a convex clip plane set
      const planeSet = ConvexClipPlaneSet.createEmpty();

      // Creating a bottom plane (clipping the interior below the room)
      createPlane(planeSet, -1000, false);

      // Creating a top plane (clipping the interior above the room) based on the toggle state
      toggled
        ? createPlane(planeSet, roomHeight + 2.5, true)
        : createPlane(planeSet, 10000, true);

      // Creating a clip primitive
      const prim = ClipPrimitive.createCapture(planeSet);

      // Creating a clip vector and appending the primitive
      const clip = ClipVector.createEmpty();
      clip.appendReference(prim);

      // Applying the clip vector to the view state
      viewState.setViewClip(clip);
      viewState.viewFlags = viewState.viewFlags.with("clipVolume", true);

      // Applying the updated view state to the viewport
      vp.applyViewState(viewState);

      // Invalidating decorations and triggering a render
      vp.invalidateDecorations();
      requestAnimationFrame(() => {});
    } catch (error) {
      console.log(error);
    }
  };

  // Function to get the room origin from the iModel
  const getRoomOrigin = async (selectSet: string) => {
    for await (const row of iModelConnection.createQueryReader(
      `select Origin from IFCDynamic.ifcspace where ECInstanceId = ${selectSet}`
    )) {
      return row[0];
    }
    return "";
  };

  // Function to create a clip plane and add it to the plane set
  const createPlane = (
    planeSet: ConvexClipPlaneSet,
    z: number,
    top: boolean
  ) => {
    const topPlaneOffset = -1.0;
    const botPlaneOffset = -1.0;
    const normal = Vector3d.create(0, 0, top ? -1.0 : 1.0);
    const origin = Point3d.create(
      0,
      0,
      top ? z + topPlaneOffset : z + botPlaneOffset
    );

    const plane = Plane3dByOriginAndUnitNormal.create(origin, normal);
    if (undefined === plane) return;

    planeSet.addPlaneToConvexSet(ClipPlane.createPlane(plane));
  };

  // Text for the button based on the toggle state
  const buttonText = toggled ? "Show Interior" : "Hide Interior";

  // Click event handler for the button
  const handleClick = () => {
    roomLevelHeight(selectSet);
  };

  // Rendering the component
  return (
    <>
      <button className="button" onClick={() => handleClick()}>
        {buttonText}
      </button>
    </>
  );
};

export default LevelCliper;
