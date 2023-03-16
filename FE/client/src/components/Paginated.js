import React from "react";
import ReactPaginate from "react-paginate";
import { useState } from "react";

const Paginated = () => {
  const [page, setPage] = useState(0);

  let pageNumber = 0;
  const active = "border border-gray-700 p-1 px-3 rounded-md bg-main-400";
  const noActive =
    "border border-gray-700 p-1 px-3 rounded-md hover:bg-main-400";
  const handlePage = (event) => {
    setPage(+event.target.textContent);
  };
  return (
    <div className="flex justify-center">
      <div className="flex gap-2">
        <div className="border border-gray-700 p-1 px-3 rounded-md">Pre</div>
        {[1, 2, 3, 4, 5, 6, 8, 9].map((el, index) => {
          return (
            <div
              key={index}
              onClick={handlePage}
              className={index + 1 === page ? active : noActive}
            >
              {el}
            </div>
          );
        })}
        <div className="border border-gray-700 p-1 rounded-md px-3">Next</div>
      </div>
    </div>
  );
};

export default Paginated;
