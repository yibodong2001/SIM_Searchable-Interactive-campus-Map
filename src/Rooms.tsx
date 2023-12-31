import {
  UiItemsProvider,
  StagePanelLocation,
  StagePanelSection,
  Widget,
  WidgetState,
  useActiveIModelConnection,
  useActiveViewport,
} from "@itwin/appui-react";
import { useEffect, useState } from "react";
import LevelCliper from "./LevelCliper";
import {
  ScreenViewport,
  IModelConnection,
  EmphasizeElements,
} from "@itwin/core-frontend";
import { ColorDef, Hilite } from "@itwin/core-common";
import SearchBox from "./SearchBox";
import List from "./List";
import BuildingsIModelId from "./data/BuildingsIModelId.json";
import BuildingsName from "./data/BuildingsName.json";
import Rooms from "./data/Building_Rooms.json";
import RoomsName from "./data/RoomsName.json";
import Courses from "./data/Courses_Room.json";
import CoursesName from "./data/CoursesName.json";
import RoomsModelId from "./data/RoomsModelId.json";
import { subscribeToClickEvent, unsubscribeFromClickEvent } from "./events";
import { JsonType } from "./Decorator";
export type RoomType = {
  [key: string]: string[];
};
export const RoomsWidget = () => {
  const [search, setSearch] = useState<string>("");
  const [searchRoomResult, setSearchRoomResult] = useState<string[]>([""]);
  const [currentBuildingName, setCurrentBuildingName] = useState<string>("");
  const [selectSet, setSelectSet] = useState<string>(); //set the id of the selected room
  const iModelConnection = useActiveIModelConnection() as IModelConnection;
  const vp = useActiveViewport() as ScreenViewport;
  const color = ColorDef.from(0, 84, 159);
  const newHiliteSettings = new Hilite.Settings(color, 50);
  vp.hilite = newHiliteSettings;
  const EmphasizeElement = new EmphasizeElements();
  const roomsId: RoomType = Rooms;
  const buildingsName: JsonType = BuildingsName;
  const roomsName: JsonType = RoomsName;
  const coursesName: JsonType = CoursesName;
  const courses: JsonType = Courses;
  const roomsModelId: JsonType = RoomsModelId;
  const urlParams = new URLSearchParams(window.location.search);
  const thisIModelId = urlParams.get("iModelId") as string; // get the imodel id of current imodel

  const building = Object.entries(BuildingsIModelId).find(
    (building) => building[1] === thisIModelId
  )!; //find the building id according to the current imodel id

  useEffect(() => {
    const matchBuilding = () => {
      if (building) {
        setSearchRoomResult(roomsId[building[0]]); //show all the rooms in the current building in the result list
        setCurrentBuildingName(buildingsName[building[0]]); // show the current building name
      }
    };
    subscribeToClickEvent(matchBuilding);
    return () => {
      unsubscribeFromClickEvent(matchBuilding);
    };
  }, []);

  useEffect(() => {
    if (building) {
      const filteredResults = roomsId[building[0]].filter(
        (roomId) =>
          roomsName[roomId].toLowerCase().includes(search.toLowerCase()) || //search rooms according to the room name
          Object.keys(Courses)
            .filter((coursesId) => courses[coursesId] === roomId)
            .some((courseId) =>
              coursesName[courseId]
                .toLocaleLowerCase()
                .includes(search.toLowerCase())
            ) || // search rooms according to the course name
          roomId.toLowerCase().includes(search.toLowerCase()) || //search rooms according to the room id
          Object.keys(Courses)
            .filter((coursesId) => courses[coursesId] === roomId)
            .some((courseId) =>
              courseId.toLocaleLowerCase().includes(search.toLowerCase())
            ) // search rooms according to the course id
      );
      setSearchRoomResult(filteredResults); //show all the rooms that match the search
      setCurrentBuildingName(buildingsName[building[0]]);
    }
  }, [search]);

  const handleClick = (roomId: string) => {
    setSelectSet(roomsModelId[roomId]);
  };

  function zoomToRoom(): Promise<void> {
    return new Promise<void>((resolve) => {
      EmphasizeElement.emphasizeSelectedElements(vp);
      if (selectSet) {
        vp.zoomToElements(selectSet as string, {
          animateFrustumChange: true,
          standardViewId: 6,
          paddingPercent: 0.25,
        });
      }

      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }
  function zoomOut() {
    vp.zoom(undefined, 5, {
      animateFrustumChange: true,
    });
  }

  function zoom() {
    zoomToRoom().then(() => {
      zoomOut();
    });
  }

  useEffect(() => {
    if (selectSet) {
      iModelConnection.selectionSet.emptyAll();
      iModelConnection.selectionSet.add(selectSet as string);
      zoom();
    }
  }, [selectSet]);
  console.log(
    iModelConnection.ecefLocation?.cartographicOrigin?.latitudeDegrees
  );

  return (
    <div>
      <LevelCliper selectSet={selectSet as string}></LevelCliper>
      <SearchBox search={search} setSearch={setSearch}></SearchBox>
      <p>Rooms of {currentBuildingName}:</p>
      <List roomsId={searchRoomResult} handleClick={handleClick}></List>
    </div>
  );
};

export class RoomsProvider implements UiItemsProvider {
  public readonly id: string = "RoomProvider";
  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "Rooms",
        label: "Rooms",
        defaultState: WidgetState.Open,
        content: <RoomsWidget />,
      });
    }
    return widgets;
  }
}
