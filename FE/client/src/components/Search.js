import React, { useRef } from "react";
import icons from "../utils/icons";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import path from "../utils/path";
import { useParams } from "react-router-dom";

const { AiOutlineSearch, BsMicFill } = icons;
const Search = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { key } = useParams();
  const [input, setInput] = useState("");
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Xử lý khi người dùng nhấn phím Enter
      navigate("search/" + event.target.value);
      setInput("");
    }
  };
  const handleSearch = () => {
    if (input != "") {
      navigate("search/" + input);
      setInput("");
    }
  };
  const handleSearchButton = () => {
    const mic = document.getElementById("mic");
    const recognition = new window.webkitSpeechRecognition();
    if (mic.classList?.contains("animate-pulse")) {
      // đang bật mic thì tắt đi
      recognition.stop();
      console.log("stop");
      mic.classList?.remove("animate-pulse");
    } else {
      recognition.lang = "vi-VN";
      recognition.start();
      mic.classList?.add("animate-pulse", "text-[30px]");
      recognition.onresult = function (event) {
        const text = event.results[0][0].transcript;
        ref.current.value = text.replace(/\./g, "");
        setInput(ref.current.value);
        mic.classList?.remove("animate-pulse");
        navigate("search/" + ref.current.value);
      };
    }
  };
  return (
    <div className="w-full flex items-center">
      <span
        onClick={handleSearch}
        className="h-10 pl-4 flex bg-[#DDE4E4] hover:text-[#000] items-center justify-center rounded-l-[20px] text-gray-500 cursor-pointer"
      >
        <AiOutlineSearch size={24} />
      </span>
      <input
        id="input_value"
        ref={ref}
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
        type="text"
        className="outline-none w-full text-gray-500 bg-[#DDE4E4] px-4 py-2  h-10 w cursor-pointer"
        placeholder="Tìm kiếm .........."
      />
      <span
        onClick={handleSearchButton}
        className="h-10 px-4 flex bg-[#DDE4E4] hover:text-[#000] items-center justify-center rounded-r-[20px] text-gray-700 cursor-pointer"
      >
        <BsMicFill id="mic" className="" size={24} />
      </span>
    </div>
  );
};

export default Search;
