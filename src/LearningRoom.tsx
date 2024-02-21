import { subscribeToClickEvent3, unsubscribeFromClickEvent3 } from "./events";
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
import { ScreenViewport, IModelConnection } from "@itwin/core-frontend";
import SearchBox from "./SearchBox";
import { clickedMarkerBuildingAddress } from "./Decorator";
import { learningRoomsCoordinates } from "./data/learningRoomCoordinates";
import { zoom } from "./zoomToElement";
import ChangePages from "./ChangePages";
import Content from "./Content";
import { handleMarker } from "./handleMarkers";

export const LearningRoomsWidget = () => {
  // State for search input, search results, selected room, and pagination
  const initialSearch = localStorage.getItem("myValue") || "";
  const [search, setSearch] = useState<string>(initialSearch);
  const [searchResult, setSearchResult] = useState<string[]>([]);
  const [selectSet, setSelectSet] = useState<string>(); //set the id of the selected room
  const iModelConnection = useActiveIModelConnection() as IModelConnection;
  const vp = useActiveViewport() as ScreenViewport;
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(10);
  const [page, setPage] = useState(1);

  // Effect to store search value in local storage
  useEffect(() => {
    localStorage.setItem("myValue", search);
  }, [search]);

  // Effect to reset pagination when search changes
  useEffect(() => {
    setPage(1);
    setPageStart(0);
    setPageEnd(10);
  }, [search]);

  // Filtering search results based on the search term and current page
  useEffect(() => {
    const filteredResults = Object.keys(learningRoomsCoordinates).filter(
      (lectureRoom) => lectureRoom.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResult(filteredResults);
  }, [search, page]);

  // Subscribing to the click event for markers to update the search term
  useEffect(() => {
    const clickMarker = () => {
      setSearch(clickedMarkerBuildingAddress);
    };

    subscribeToClickEvent3(clickMarker);
    return () => {
      unsubscribeFromClickEvent3(clickMarker);
    };
  }, []);

  // Zooming to the selected room when it changes
  useEffect(() => {
    if (selectSet) {
      zoom(vp, selectSet, iModelConnection);
    }
  }, [selectSet]);

  // Handling markers based on search results
  useEffect(() => {
    handleMarker(iModelConnection, learningRoomsCoordinates, searchResult);
  }, [searchResult, search]);

  return (
    <>
      <button
        className="button"
        onClick={() =>
          handleMarker(iModelConnection, learningRoomsCoordinates, searchResult)
        }
      >
        Show All Learning Rooms
      </button>
      <LevelCliper selectSet={selectSet as string}></LevelCliper>
      <SearchBox
        search={search}
        setSearch={setSearch}
        placeHolder="Search for Learning Rooms"
      ></SearchBox>
      {searchResult.slice(pageStart, pageEnd).map((lecture) => (
        <ul>
          <li className="List" id="List">
            <strong>{lecture}</strong>
          </li>
          <Content
            roomInfo={lecture}
            setSearch={setSearch}
            setSelectSet={setSelectSet}
          ></Content>
        </ul>
      ))}
      <ChangePages
        searchResult={searchResult}
        page={page}
        pageStart={pageStart}
        pageEnd={pageEnd}
        setPageStart={setPageStart}
        setPageEnd={setPageEnd}
        setPage={setPage}
      ></ChangePages>
    </>
  );
};

export class LearningRoomsProvider implements UiItemsProvider {
  public readonly id: string = "LearningRoomsProvider";
  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "Learning Rooms",
        label: "Learning Rooms",
        defaultState: WidgetState.Open,
        content: <LearningRoomsWidget />,
      });
    }
    return widgets;
  }
}
