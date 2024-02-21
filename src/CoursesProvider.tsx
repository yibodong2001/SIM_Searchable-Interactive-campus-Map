import {
  UiItemsProvider,
  StagePanelLocation,
  StagePanelSection,
  Widget,
  WidgetState,
} from "@itwin/appui-react";
import { ScheduleWidget } from "./Schedule";
import { useState } from "react";

export const CoursesWidget = () => {
  // Array representing days of the week
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Getting the current day of the week
  const week: number = new Date().getDay();
  let dayOfToday: string; // Declare the variable outside the if-else block

  // Assigning the day of the week based on the current date
  dayOfToday = daysOfWeek[week - 1];

  // State hook to manage the selected day
  const [selectedDay, setSelectedDay] = useState<string>(dayOfToday);

  // Event handler for select element change
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "Today") {
      // Update selected day to the current day if "Today" is selected
      setSelectedDay(dayOfToday);
    } else {
      // Update selected day based on the selected value
      setSelectedDay(event.target.value);
    }
  };

  return (
    <div className="selector-container">
      {/* Dropdown for selecting a day */}
      <select
        className="selector"
        value={selectedDay}
        onChange={handleSelectChange}
      >
        <option value="" disabled>
          Select a day
        </option>
        {daysOfWeek.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>

      {/* Displaying the ScheduleWidget based on the selected day */}
      <ScheduleWidget dateOfWeek={selectedDay}></ScheduleWidget>
    </div>
  );
};

export class CoursesProvider implements UiItemsProvider {
  public readonly id: string = "CoursesProvider";
  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "Courses",
        label: "Courses",
        defaultState: WidgetState.Open,
        content: <CoursesWidget />,
      });
    }
    return widgets;
  }
}
