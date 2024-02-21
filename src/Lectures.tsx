import {
  emitClickEvent,
  emitClickEvent2,
  subscribeToClickEvent3,
  unsubscribeFromClickEvent3,
  emitClickEvent6,
} from "./events";
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
import Lecture from "./data/terminList_export.json";
import { zoom } from "./zoomToElement";
import { CoursesType } from "./types";
import ChangePages from "./ChangePages";
import Content from "./Content";
import { handleMarker } from "./handleMarkers";
import { buildingCoordinates } from "./data/buildingCoordinates";

// Array to store the current filtered addresses
export let currentFilteredAddressesArray: string[] = [];

// Function to set the current filtered addresses array and emit a click event
export const getFilteredAddressesArray = async (
  filteredAddressesArray: string[]
) => {
  currentFilteredAddressesArray = filteredAddressesArray;
  await new Promise<void>((resolve) => {
    resolve();
  });
  emitClickEvent6();
};

// Variable to store the current iModel ID
export let currentIModelId = process.env.IMJS_IMODEL_ID;

// Function to set the current iModel ID and emit a click event
export const getImodelId = async (Id: string) => {
  currentIModelId = Id;
  await new Promise<void>((resolve) => {
    resolve();
  });
  emitClickEvent();
};

// Variable to store the current room ID
export let currentRoomId: string = "please select a room";

// Function to set the current room ID and emit a click event
export const getRoomId = async (Id: string) => {
  currentRoomId = Id;
  await new Promise<void>((resolve) => {
    resolve();
  });
  emitClickEvent2();
};

export const LecturesWidget = () => {
  // Retrieving the initial search value from local storage or using an empty string
  const initialSearch = localStorage.getItem("myValue") || "";
  // State to manage the search term
  const [search, setSearch] = useState<string>(initialSearch);
  // State to store search results
  const [searchResult, setSearchResult] = useState<CoursesType[]>([]);
  // State to store the selected room ID
  const [selectSet, setSelectSet] = useState<string>();
  // Accessing the active iModel connection and viewport
  const iModelConnection = useActiveIModelConnection() as IModelConnection;
  const vp = useActiveViewport() as ScreenViewport;
  // States for managing pagination
  const [pageStart, setPageStart] = useState(0);
  const [pageEnd, setPageEnd] = useState(10);
  const [page, setPage] = useState(1);

  // Saving the search term to local storage when it changes
  useEffect(() => {
    localStorage.setItem("myValue", search);
  }, [search]);

  // Resetting pagination when the search term changes
  useEffect(() => {
    setPage(1);
    setPageStart(0);
    setPageEnd(10);
  }, [search]);

  // Filtering search results based on the search term and current page
  useEffect(() => {
    const filteredResults = Lecture.filter(
      (lecture) =>
        lecture.Rooms.toLowerCase().includes(search.toLowerCase()) ||
        lecture.Name.toLowerCase().includes(search.toLowerCase()) ||
        lecture.LvNummer.toString().includes(search)
    );
    // Removing duplicate lectures based on LvNummer
    const seenNames = new Set();
    const uniqueFilteredResults = filteredResults.filter((lecture) => {
      if (!seenNames.has(lecture.LvNummer)) {
        seenNames.add(lecture.LvNummer);
        return true;
      }
      return false;
    });
    setSearchResult(uniqueFilteredResults);
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

  // Sorting the search results alphabetically by lecture name
  const sortedSearchResult = searchResult.sort((a, b) =>
    a.Name.localeCompare(b.Name)
  );

  // Extracting room information from search results
  const roomsInfo = searchResult
    .map((course) => course.Rooms)
    .filter((item) => item !== "No room allocated");

  // Extracting locations from room information
  const locations = roomsInfo.map((item) => {
    const match = item.match(/,([^,|]+?)\|/);
    return match ? match[1].trim() : "null";
  });
  // Removing duplicates from the locations array
  const filteredMarkerArray = [...new Set(locations)];

  // Handling markers based on search results
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
        Show All Locations
      </button>
      <LevelCliper selectSet={selectSet as string}></LevelCliper>
      <SearchBox
        search={search}
        setSearch={setSearch}
        placeHolder="Search for Lectures"
      ></SearchBox>
      <small>
        *Searchable by classroom name and number, lecture name and number
      </small>
      {sortedSearchResult.slice(pageStart, pageEnd).map((lecture) => (
        <ul>
          <li className="List" id="List">
            <strong>
              {lecture.Name.substring(0, lecture.Name.lastIndexOf(","))}
            </strong>
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

export class LecturesProvider implements UiItemsProvider {
  public readonly id: string = "LecturesProvider";
  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "Lectures",
        label: "Lectures",
        defaultState: WidgetState.Open,
        content: <LecturesWidget />,
      });
    }
    return widgets;
  }
}
