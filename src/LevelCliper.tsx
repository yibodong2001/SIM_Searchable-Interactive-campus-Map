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

type setSelectSet = {
  selectSet: string;
};
const LevelCliper = ({ selectSet }: setSelectSet) => {
  const iModelConnection = useActiveIModelConnection() as IModelConnection;
  const [toggled, setToggled] = useState<boolean>(true);
  const roomLevelHight = async (selectSet: string) => {
    try {
      const vp = IModelApp.viewManager.selectedView!;
      const viewState = vp.view;
      // const levelName = await getLevelName(selectSet);
      // const levelHeight = await getLevelHight(levelName);
      // const roomHeight = await getRoomHeight(selectSet);
      const roomOrigin = await getRoomOrigin(selectSet);
      const roomHeight = roomOrigin.Z;
      console.log(roomHeight);
      setToggled(!toggled);
      const planeSet = ConvexClipPlaneSet.createEmpty();
      createPlane(planeSet, -1000, false);
      toggled
        ? // ? createPlane(planeSet, levelHeight + roomHeight - 0.5, true)
          createPlane(planeSet, roomHeight + 2.5, true)
        : createPlane(planeSet, 10000, true);

      const prim = ClipPrimitive.createCapture(planeSet);
      const clip = ClipVector.createEmpty();
      clip.appendReference(prim);
      viewState.setViewClip(clip);
      viewState.viewFlags = viewState.viewFlags.with("clipVolume", true);
      vp.applyViewState(viewState);
      vp.invalidateDecorations();
      requestAnimationFrame(() => {});
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  const getRoomOrigin = async (selectSet: string) => {
    for await (const row of iModelConnection.createQueryReader(
      `select Origin from IFCDynamic.ifcspace where ECInstanceId = ${selectSet}`
    )) {
      return row[0];
    }
    return "";
  };

  // const getRoomHeight = async (selectSet: string) => {
  //   for await (const row of iModelConnection.createQueryReader(
  //     `select ROOM_HEIGHT from RevitDynamic.RoomElem where ECInstanceId = ${selectSet}`
  //   )) {
  //     return row[0];
  //   }
  //   return "";
  // };
  // const getLevelName = async (selectSet: string) => {
  //   //The for loop will now need to be in an async function itself to allow for the await operator
  //   for await (const row of iModelConnection.createQueryReader(
  //     `select ROOM_LEVEL_ID from RevitDynamic.RoomElem where ECInstanceId = ${selectSet}`
  //   )) {
  //     return row[0];
  //   }
  //   return "";
  // };
  // const getLevelHight = async (levelName: string) => {
  //   for await (const row of iModelConnection.createQueryReader(
  //     `select LEVEL_ELEV from RevitDynamic.level where CodeValue ='${levelName}'`
  //   )) {
  //     return row[0];
  //   }
  //   return 0;
  // };
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
  const buttonText = toggled ? "Show Interior" : "Hide Interior";
  const handleClick = () => {
    roomLevelHight(selectSet);
  };

  return (
    <>
      <button className="button" onClick={() => handleClick()}>
        {buttonText}
      </button>
    </>
  );
};

export default LevelCliper;
