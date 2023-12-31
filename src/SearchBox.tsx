type search = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBox = ({ search, setSearch }: search) => {
  return (
    <nav className="Search">
      <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="search"></label>
        <input
          id="search"
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
      </form>
    </nav>
  );
};

export default SearchBox;
