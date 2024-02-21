import { searchType } from "./types";

const SearchBox = ({ search, setSearch, placeHolder }: searchType) => {
  return (
    <nav className="Search">
      <div className="searchForm" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="search"></label>
        <input
          id="search"
          type="text"
          placeholder={placeHolder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <button
          id="clearButton"
          aria-label="clear"
          onClick={() => setSearch("")}
        >
          x
        </button>
      </div>
    </nav>
  );
};

export default SearchBox;
