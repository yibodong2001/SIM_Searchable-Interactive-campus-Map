import {
  UiItemsProvider,
  StagePanelLocation,
  StagePanelSection,
  Widget,
  WidgetState,
} from "@itwin/appui-react";
import { currentCourseName } from "./Schedule";
import Courses from "./data/terminList_export.json";
import { useState, useEffect } from "react";
import { CoursesType } from "./types";
import { subscribeToClickEvent5, unsubscribeFromClickEvent5 } from "./events";

export const CoursesInfoWidget = () => {
  const [course, setCourse] = useState<CoursesType>();
  useEffect(() => {
    // Function to update the selected course based on the currentCourseName
    const changeCourse = () => {
      setCourse(Courses.find((course) => course.Name === currentCourseName));
    };

    subscribeToClickEvent5(changeCourse);
    return () => {
      unsubscribeFromClickEvent5(changeCourse);
    };
  }, []);

  return course ? (
    <table className="custom-table">
      <tbody>
        {/* Mapping over the properties of the selected course and displaying them in a table */}
        {Object.entries(course).map(([key, value]) => (
          <tr key={key}>
            <td className="table-key">{key}</td>
            <td className="table-value">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    // Message displayed when no course is selected
    <p>Please select a course</p>
  );
};

export class CoursesInfoProvider implements UiItemsProvider {
  public readonly id: string = "ClassInfoProvider";
  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "CoursesInfo",
        label: "CoursesInfo",
        defaultState: WidgetState.Open,
        content: <CoursesInfoWidget />,
      });
    }
    return widgets;
  }
}
