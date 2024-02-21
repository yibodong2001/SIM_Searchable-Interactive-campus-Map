import { getRoomId } from "./Lectures";
import { getImodelId } from "./Lectures";
import { currentIModelId } from "./Lectures";
import BuildingsIModelId from "./data/BuildingsIModelId.json";
import { JsonType } from "./Decorator";
import RoomsModelId from "./data/RoomsModelId.json";
import { ContentType, CoursesType } from "./types";
import { getCourseName } from "./Schedule";

// Function to extract address from room information
export const getAddressFromRoomInfo = (courseRoomsInfo: string) => {
  const matchModel = courseRoomsInfo.match(/,([^,|]+?)\|/);
  return matchModel![1].trim();
};

const Content = ({ roomInfo, setSearch, setSelectSet }: ContentType) => {
  // JSON data for room models and building iModelIds
  const roomsModelId: JsonType = RoomsModelId;
  const building_iModelId: JsonType = BuildingsIModelId;

  // Function to handle clicking on the Room button
  async function handleClickRoom(courseRooms: string | CoursesType) {
    if (!(courseRooms === "No room allocated")) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("iModelId")) {
        const courseRoomsInfo =
          typeof courseRooms === "string" ? courseRooms : courseRooms.Rooms;
        const address = getAddressFromRoomInfo(courseRoomsInfo);
        const iModelId = building_iModelId.hasOwnProperty(address)
          ? building_iModelId[address]
          : alert("Model undefined");

        if (iModelId) {
          if (iModelId === currentIModelId) {
            handleZoomRoom(courseRoomsInfo);
          } else {
            getImodelId(iModelId);
            const search =
              typeof courseRooms === "string" ? courseRooms : courseRooms.Name;
            setSearch(search);
          }
        }
      }
    } else {
      alert("No room allocated");
    }
  }

  // Function to handle clicking on the Info button
  const handleClickInfo = (courseRooms: string | CoursesType) => {
    const regex = /\(([^)]+)\)/;
    const courseRoomsInfo =
      typeof courseRooms === "string" ? courseRooms : courseRooms.Rooms;
    const lectureName =
      typeof courseRooms === "string" ? "null" : courseRooms.Name;
    const matchRoomId = regex.exec(courseRoomsInfo);
    if (matchRoomId) {
      const roomId = matchRoomId[1];
      getRoomId(roomId);
      getCourseName(lectureName);
    }
  };

  const handleZoomRoom = (courseRooms: string | CoursesType) => {
    const courseRoomsInfo =
      typeof courseRooms === "string" ? courseRooms : courseRooms.Rooms;

    setSelectSet(roomsModelId[courseRoomsInfo]);
    getRoomId(courseRoomsInfo);
  };

  // Function to handle clicking on the Navigation button
  const handleClickNavigation = (courseRooms: string | CoursesType) => {
    const courseRoomsInfo =
      typeof courseRooms === "string" ? courseRooms : courseRooms.Rooms;

    if (!(courseRoomsInfo === "No room allocated")) {
      const match = courseRoomsInfo.match(/,([^,|]+?)\|/);
      const address = match![1].trim();
      alert(address);
      window.open(
        `https://www.google.com/maps/place/${address} aachen`,
        "_blank"
      );
    } else {
      alert("No room allocated");
    }
  };

  return (
    <div className="buttonContainer">
      {" "}
      <button
        onClick={() => {
          handleClickRoom(roomInfo);
        }}
      >
        Room
      </button>
      <button
        onClick={() => {
          handleClickInfo(roomInfo);
        }}
      >
        Info
      </button>
      <button
        onClick={() => {
          handleClickNavigation(roomInfo);
        }}
      >
        Map
      </button>
    </div>
  );
};

export default Content;
