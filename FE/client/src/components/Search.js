import React from "react";
import icons from "../utils/icons";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import path from "../utils/path"
import { useParams } from "react-router-dom";

const { AiOutlineSearch, BsMicFill } = icons;
const Search = () => {
  const navigate = useNavigate()
  const { key} = useParams();
  const [input, setInput] = useState("");
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Xử lý khi người dùng nhấn phím Enter
      navigate('search/' + event.target.value)
      setInput("")
    }
  };
  return (
    <div className="w-full flex items-center">
      <span className="h-10 pl-4 flex bg-[#DDE4E4] hover:text-[#000] items-center justify-center rounded-l-[20px] text-gray-500 cursor-pointer">
        <AiOutlineSearch size={24} />
      </span>
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
        type="text"
        className="outline-none w-full text-gray-500 bg-[#DDE4E4] px-4 py-2  h-10 w cursor-pointer"
        placeholder="Tìm kiếm .........."
      />
      <span className="h-10 px-4 flex bg-[#DDE4E4] hover:text-[#000] items-center justify-center rounded-r-[20px] text-gray-500 cursor-pointer">
        <BsMicFill size={24} />
      </span>
    </div>
  );
};

export default Search;
