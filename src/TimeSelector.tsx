import { time } from "./data/schedule";
import { selectorType } from "./types";

const TimeSelector = ({
  daysOfWeek,
  selectedDay,
  selectedTime,
  setSelectedTime,
  setSelectedDay,
  dayOfToday,
}: selectorType) => {
  const handleSelectChangeDay = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (event.target.value === "Today") {
      setSelectedDay(dayOfToday);
    } else {
      setSelectedDay(event.target.value);
    }
  };

  return (
    <div className="selector-container">
      <select
        className="selector"
        value={selectedDay}
        onChange={handleSelectChangeDay}
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
      <select
        className="selector"
        value={selectedTime}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
          setSelectedTime(event.target.value)
        }
      >
        <option value="" disabled>
          Select Time
        </option>
        {time.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeSelector;
