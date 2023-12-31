import { useState, useEffect } from "react";
import { emitClickEvent } from "./events";
import {
  UiItemsProvider,
  StagePanelLocation,
  StagePanelSection,
  Widget,
  WidgetState,
} from "@itwin/appui-react";

import BuildingsName from "./data/BuildingsName.json";
import BuildingsIModelId from "./data/BuildingsIModelId.json";
import BuildingsCoordinates from "./data/BuildingsCoordinates.json";
import Rooms from "./data/Building_Rooms.json";
import RoomsName from "./data/RoomsName.json";
import Courses from "./data/Courses_Room.json";
import CoursesName from "./data/CoursesName.json";
import { JsonType } from "./Decorator";
import SearchBox from "./SearchBox";
import { clickedMarkerBuildingId } from "./Decorator";
import { RoomType } from "./Rooms";
import { subscribeToClickEvent, unsubscribeFromClickEvent } from "./events";
export let currentIModelId = process.env.IMJS_IMODEL_ID;
export const getImodelId = async (Id: string) => {
  currentIModelId = Id;
  await new Promise<void>((resolve) => {
    resolve();
  });
  emitClickEvent();
};

export const BuildingWidget = () => {
  // const building_name: JsonType = BuildingsName;

  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<string[]>([""]);
  const building_iModelId: JsonType = BuildingsIModelId;
  const building_coordinates: JsonType = BuildingsCoordinates;
  const buildingsName: JsonType = BuildingsName;
  const rooms: RoomType = Rooms;
  const roomsName: JsonType = RoomsName;
  const courses: JsonType = Courses;
  const coursesName: JsonType = CoursesName;

  useEffect(() => {
    const filteredResults = Object.keys(BuildingsName).filter(
      (buildingId) =>
        buildingId.toLowerCase().includes(search.toLowerCase()) || //search building accordinh to building id
        buildingsName[buildingId]
          .toLowerCase()
          .includes(search.toLowerCase()) || //search buidling according to building name
        rooms[buildingId].some(
          (roomId) =>
            roomsName[roomId].toLowerCase().includes(search.toLowerCase()) //search buildings according to the room name
        ) ||
        rooms[buildingId].some((roomId) =>
          roomId.toLowerCase().includes(search.toLowerCase())
        ) || //search building according to the room id
        rooms[buildingId].some((roomId) =>
          Object.keys(Courses)
            .filter((coursesId) => courses[coursesId] === roomId)
            .some((coursesId) =>
              coursesName[coursesId]
                .toLowerCase()
                .includes(search.toLowerCase())
            )
        ) || //search building according to the course name
        rooms[buildingId].some((roomId) =>
          Object.keys(courses)
            .filter((courseId) => courses[courseId] === roomId)
            .some((coursesId) =>
              coursesId.toLowerCase().includes(search.toLowerCase())
            )
        ) // search buildin according to the course id
    );

    setSearchResult(filteredResults);
  }, [search]);

  useEffect(() => {
    const clickMarker = () => {
      setSearch(buildingsName[clickedMarkerBuildingId]);
    };

    subscribeToClickEvent(clickMarker);
    return () => {
      unsubscribeFromClickEvent(clickMarker);
    };
  }, []);

  const handleClickChangeModel = (BuildingId: string) => {
    const iModelId = building_iModelId[BuildingId];

    getImodelId(iModelId); //get the model id of the clicked model
  };

  const handleClickNavigation = (BuildingId: string) => {
    const coordinate = building_coordinates[BuildingId];

    window.open(`https://www.google.com/maps/place/${coordinate}`, "_blank");
  };

  return (
    <>
      <SearchBox search={search} setSearch={setSearch}></SearchBox>
      {searchResult.map((buildingId) => (
        <ul className="List" id="List">
          <li
            className="List"
            id="List"
            // key={building.iModelId}
          >
            {buildingsName[buildingId]}
            <br></br>
            <button
              onClick={() => {
                handleClickChangeModel(buildingId);
              }}
            >
              Checkt the Model
            </button>
            <br></br>
            <button
              onClick={() => {
                handleClickNavigation(buildingId);
              }}
            >
              Navigation
            </button>
            {/* <Navi building_id={value[0]}></Navi> */}
          </li>
        </ul>
      ))}
    </>
  );
};

export class BuildingsProvider implements UiItemsProvider {
  //export为了能从其他文件中访问
  public readonly id: string = "BuildingsProvider";
  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "Buildings",
        label: "Buildings",
        defaultState: WidgetState.Open,
        content: <BuildingWidget />,
      });
    }
    return widgets;
  }
}
