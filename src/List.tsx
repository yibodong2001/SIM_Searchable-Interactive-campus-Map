import RoomsName from "./data/RoomsName.json";
import Courses from "./data/Courses_Room.json";
import CoursesName from "./data/CoursesName.json";
import { JsonType } from "./Decorator";

interface rooms {
  roomsId: string[];
  handleClick: (roomName: string) => void;
}

const List = ({ roomsId, handleClick }: rooms) => {
  const roomsName: JsonType = RoomsName;
  const courses: JsonType = Courses;
  const coursesName: JsonType = CoursesName;
  return (
    <>
      {roomsId.map((roomId) => (
        <ul className="List" id="List">
          <li
            id="List"
            // key={room.id}
            onClick={() => {
              handleClick(roomId);
            }}
          >
            {roomsName[roomId]}
            <br />
            {Object.keys(Courses)
              .filter((courseId) => courses[courseId] === roomId)
              .map(
                (cousreId) => cousreId + " : " + coursesName[cousreId] + "|"
              )}
          </li>
        </ul>
      ))}
    </>
  );
};

export default List;
