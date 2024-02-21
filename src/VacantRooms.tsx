import { subscribeToClickEvent3, unsubscribeFromClickEvent3 } from "./events";
import {
  UiItemsProvider,
  StagePanelLocation,
  StagePanelSection,
  Widget,
  WidgetState,
  useActiveViewport,
  useActiveIModelConnection,
} from "@itwin/appui-react";
import { useEffect, useState } from "react";
import LevelCliper from "./LevelCliper";
import { ScreenViewport, IModelConnection } from "@itwin/core-frontend";
import SearchBox from "./SearchBox";
import { clickedMarkerBuildingAddress } from "./Decorator";
import Courses from "./data/terminList_export.json";
import { zoom } from "./zoomToElement";
import TimeSelector from "./TimeSelector";
import ChangePages from "./ChangePages";
import Content from "./Content";
import { handleMarker } from "./handleMarkers";
import { buildingCoordinates } from "./data/buildingCoordinates";

export const RoomWidget = () => {
  const iModelConnection = useActiveIModelConnection() as IModelConnection;
  const vp = useActiveViewport() as ScreenViewport;
  const initialSearch = localStorage.getItem("myValue") || "";
  const [search, setSearch] = useState<string>(initialSearch);
  const [searchResult, setSearchResult] = useState<string[]>([]);
  const [selectSet, setSelectSet] = useState<string>(); //set the id of the selected room
  const week: number = new Date().getDay();
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let dayOfToday: string =
    1 <= week && week <= 5 ? daysOfWeek[week - 1] : "Weekend"; // Declare the variable outside the if-else block
  const [selectedDay, setSelectedDay] = useState<string>(dayOfToday);
  const [selectedTime, setSelectedTime] = useState<string>("00:00");
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(10);
  const [page, setPage] = useState(1);

  const convertTimeToNumber = (timeString: string): number => {
    const cleanedTime = timeString.replace(":", "");
    return parseInt(cleanedTime, 10);
  };

  //filter out rooms which has a data arranged in the schedule
  const filterLectureHasDate = Courses.filter(
    (lecture) => lecture.Rooms !== "No room allocated"
  );

  const roomsInfo: string[] = [];

  //Extract classroom location information for all classrooms
  filterLectureHasDate.forEach((room) => roomsInfo.push(room.Rooms));

  //Make sure all classrooms only exist once in the array
  const uniqueRoomsInfo: string[] = [...new Set(roomsInfo)];

  //find the classroom which is occupied now
  useEffect(() => {
    //filter out rooms which has a data arranged in the schedule and occupied right now
    const filterOccupiedRoom = filterLectureHasDate.filter(
      (lecture) =>
        lecture.Date.match(/(\w+),/)![1] === selectedDay &&
        convertTimeToNumber(selectedTime) <=
          convertTimeToNumber(lecture.Buchungend) &&
        convertTimeToNumber(selectedTime) >=
          convertTimeToNumber(lecture.Buchungstart)
    );
    //filter out rooms according to the search
    const filteredResults = uniqueRoomsInfo.filter(
      (roomInfo) =>
        roomInfo.toLowerCase().includes(search.toLowerCase()) ||
        roomInfo.toLowerCase().includes(search.toLowerCase())
    );

    const occupiedRoomsInfo: string[] = [];

    //Extract classroom location information for classrooms been occupied
    filterOccupiedRoom.forEach((room) => occupiedRoomsInfo.push(room.Rooms));

    //Make sure all classrooms only exist once in the array
    const uniqueOccupiedRoomsInfo: String[] = [...new Set(occupiedRoomsInfo)];

    //and..find out the free rooms! the free room is the rooms which are not OCCUPIED
    const freeRoomsInfo = filteredResults.filter(
      (room) => !uniqueOccupiedRoomsInfo.includes(room)
    );

    setSearchResult(freeRoomsInfo);
  }, [selectedTime, selectedDay]);

  useEffect(() => {
    localStorage.setItem("myValue", search);
  }, [search]);

  const initPage = () => {
    setPage(1);
    setPageStart(0);
    setPageEnd(10);
  };

  useEffect(() => {
    initPage();
  }, [search]);

  useEffect(() => {
    const filteredResults = uniqueRoomsInfo.filter(
      (uniqueRoomInfo) =>
        uniqueRoomInfo.toLowerCase().includes(search.toLowerCase()) ||
        uniqueRoomInfo.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResult(filteredResults);
  }, [search, page]);

  //set the search as the building address of the clicked marker
  useEffect(() => {
    const clickMarker = () => {
      setSearch(clickedMarkerBuildingAddress);
    };
    subscribeToClickEvent3(clickMarker);
    return () => {
      unsubscribeFromClickEvent3(clickMarker);
    };
  }, []);

  useEffect(() => {
    if (selectSet) {
      zoom(vp, selectSet, iModelConnection);
    }
  }, [selectSet]);

  const locations = searchResult.map((item) => {
    const match = item.match(/,([^,|]+?)\|/);
    return match ? match[1].trim() : "null";
  });
  const filteredMarkerArray = [...new Set(locations)];

  useEffect(() => {
    handleMarker(iModelConnection, buildingCoordinates, filteredMarkerArray);
  }, [searchResult]);
  return (
    <>
      <button
        className="button"
        onClick={() =>
          handleMarker(
            iModelConnection,
            buildingCoordinates,
            filteredMarkerArray
          )
        }
      >
        Show All Vacant Rooms
      </button>
      <LevelCliper selectSet={selectSet as string}></LevelCliper>
      <TimeSelector
        daysOfWeek={daysOfWeek}
        selectedDay={selectedDay}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        setSelectedDay={setSelectedDay}
        dayOfToday={dayOfToday}
      ></TimeSelector>
      <SearchBox
        search={search}
        setSearch={setSearch}
        placeHolder="Search for Vacant Classrooms"
      ></SearchBox>
      {searchResult.slice(pageStart, pageEnd).map((roomInfo) => (
        <ul>
          {" "}
          <li className="List" id="List">
            <strong>{roomInfo}</strong>
          </li>
          <Content
            roomInfo={roomInfo}
            setSearch={setSearch}
            setSelectSet={setSelectSet}
          ></Content>
        </ul>
      ))}
      <ChangePages
        searchResult={searchResult}
        page={page}
        setPage={setPage}
        pageStart={pageStart}
        setPageStart={setPageStart}
        pageEnd={pageEnd}
        setPageEnd={setPageEnd}
      ></ChangePages>
    </>
  );
};

export class RoomsProvider implements UiItemsProvider {
  public readonly id: string = "RoomsProvider";
  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "Vacant Classrooms",
        label: "Vacant Classrooms",
        defaultState: WidgetState.Open,
        content: <RoomWidget />,
      });
    }
    return widgets;
  }
}
