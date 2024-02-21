export interface CoursesType {
  Name: string;
  LvNummer: number;
  "Start time": string;
  Duration: number;
  "#hours": number;
  Date: string;
  Rooms: string;
  Buchungstart: string;
  Buchungend: string;
}

export type ChangePageType = {
  searchResult: string[] | CoursesType[];
  page: number;
  pageStart: number;
  pageEnd: number;
  setPageStart: React.Dispatch<React.SetStateAction<number>>;
  setPageEnd: React.Dispatch<React.SetStateAction<number>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export type ContentType = {
  roomInfo: string | CoursesType;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSelectSet: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export type searchType = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  placeHolder: string;
};

export type selectorType = {
  daysOfWeek: string[];
  selectedDay: string;
  selectedTime: string;
  setSelectedTime: React.Dispatch<React.SetStateAction<string>>;
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
  dayOfToday: string;
};

export interface dateType {
  dateOfWeek: string;
}

export type setSelectSetType = {
  selectSet: string;
};

export interface CoordinateType {
  [key: string]: number[];
}
