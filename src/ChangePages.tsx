import { ChangePageType } from "./types";

const ChangePages = ({
  searchResult,
  page,
  pageStart,
  pageEnd,
  setPageStart,
  setPageEnd,
  setPage,
}: ChangePageType) => {
  // Calculating the total number of pages based on search result length, the numbers of results per page is set to 10.
  const totalPages = Math.floor(searchResult.length / 10) + 1;

  // Handling the click event for navigating to the next page
  const handleNextPage = () => {
    if (page < totalPages) {
      // Updating page start, end, and current page state for the next page
      setPageStart(pageStart + 10);
      setPageEnd(pageEnd + 10);
      setPage(page + 1);
    }
  };

  // Handling the click event for navigating to the previous page
  const handlePrevPage = () => {
    if (page > 1) {
      // Updating page start, end, and current page state for the previous page
      setPageStart(pageStart - 10);
      setPageEnd(pageEnd - 10);
      setPage(page - 1);
    }
  };

  // Rendering the pagination UI
  return (
    <div className="pagination">
      {/* Button for navigating to the previous page */}
      <button id="prevPage" onClick={() => handlePrevPage()}>
        Previous Page
      </button>

      {/* Displaying the current page and total pages */}
      <strong>
        {page}/{totalPages}
      </strong>

      {/* Button for navigating to the next page */}
      <button id="nextPage" onClick={() => handleNextPage()}>
        Next Page
      </button>
    </div>
  );
};
export default ChangePages;
