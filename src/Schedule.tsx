import { currentRoomId } from "./Lectures";
import { useEffect, useState } from "react";
import {
  subscribeToClickEvent2,
  unsubscribeFromClickEvent2,
  emitClickEvent5,
  subscribeToClickEvent4,
  unsubscribeFromClickEvent4,
} from "./events";
import Courses from "./data/terminList_export.json";
import { CoursesType, dateType } from "./types";

// Variable to store the current course name
export let currentCourseName: string = "";

// Function to set the current course name and emit a click event
export const getCourseName = async (name: string) => {
  currentCourseName = name;
  await new Promise<void>((resolve) => {
    resolve();
  });
  emitClickEvent5(); // Emitting a click event after setting the current course name
};

// ScheduleWidget component
export const ScheduleWidget = ({ dateOfWeek }: dateType) => {
  // State to store all courses
  const [allCourses, setAllCourses] = useState<CoursesType[]>();

  // Filtering courses based on the selected date
  const courses = allCourses?.filter((course) =>
    course.Date.includes(dateOfWeek)
  );

  // Effect to subscribe and unsubscribe from click events when the room changes
  useEffect(() => {
    const changeRoom = () => {
      // Filtering courses for the current room
      setAllCourses(
        Courses.filter((course) => course.Rooms.includes(currentRoomId))
      );
    };
    subscribeToClickEvent2(changeRoom);
    subscribeToClickEvent4(changeRoom);
    return () => {
      unsubscribeFromClickEvent2(changeRoom);
      unsubscribeFromClickEvent4(changeRoom);
    };
  }, []);

  // Function to handle the click on a course and set the current course name
  const handleClick = (courseName: string) => {
    getCourseName(courseName);
  };

  // Sorting courses by start time
  const sortedCourses = courses
    ? courses.sort((a, b) => {
        const timeA = a.Buchungstart;
        const timeB = b.Buchungstart;
        if (timeA < timeB) {
          return -1;
        } else if (timeA > timeB) {
          return 1;
        } else {
          return 0;
        }
      })
    : undefined;

  return (
    <div>
      <p>
        Room: {currentRoomId} [{dateOfWeek}]
      </p>
      {allCourses ? (
        sortedCourses && sortedCourses.length > 0 ? (
          sortedCourses.map((course) => (
            <ul className="List" id="List" key={course.Name}>
              <li
                className="List"
                id="List"
                onClick={() => handleClick(course.Name)}
              >
                {course.Name}
                <br />
                start : {course.Buchungstart}
                <br />
                end : {course.Buchungend}
              </li>
            </ul>
          ))
        ) : (
          <p>No Courses on {dateOfWeek}</p>
        )
      ) : (
        <p>Please Select a Room</p>
      )}
    </div>
  );
};
