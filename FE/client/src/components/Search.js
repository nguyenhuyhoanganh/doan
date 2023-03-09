import React from "react";
import icons from "../utils/icons";

const { AiOutlineSearch, BsMicFill } = icons;
const Search = () => {
  return (
    <div className="w-full flex items-center">
      <span className="h-10 pl-4 flex bg-[#DDE4E4] hover:text-[#000] items-center justify-center rounded-l-[20px] text-gray-500 cursor-pointer">
        <AiOutlineSearch size={24}/>
      </span>
      <input
        type="text"
        className="outline-none w-full text-gray-500 bg-[#DDE4E4] px-4 py-2  h-10 w cursor-pointer"
        placeholder="Tìm kiếm .........."
      />
      <span className="h-10 px-4 flex bg-[#DDE4E4] hover:text-[#000] items-center justify-center rounded-r-[20px] text-gray-500 cursor-pointer">
        <BsMicFill size={24}/>
      </span>
    </div>
  );
};

export default Search;
