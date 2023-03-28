import React from "react";
import icons from "../utils/icons";
import { Search, LoginBar } from "./index";
const { AiOutlineArrowRight, AiOutlineArrowLeft } = icons;
const Header = () => {
  const handleBack = () => {
    window.history.back();
  };
  return (
    <div className="flex justify-between w-full items-center">
      <div className="flex gap-6 w-full items-center">
        <div className="flex gap-6 text-gray-400">
          <span onClick={handleBack} className="hover:text-[#000]">
            <AiOutlineArrowLeft size={24} />
          </span>
          {/* <span className='hover:text-[#000]'><AiOutlineArrowRight size={24}/></span> */}
        </div>
        <div className="w-1/2">
          <Search />
        </div>
      </div>
      <div className="flex">
        <LoginBar />
      </div>
    </div>
  );
};

export default Header;
