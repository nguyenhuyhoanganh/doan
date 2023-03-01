import React from "react";
import icons from "../utils/icons";

const { RiVipFill } = icons;
const LoginBar = () => {
  return (
    <div className="h-10 border flex rounded-md hover:shadow-md hover:bg-main-300">
      <div>
        <span>
          <RiVipFill size={24} color="gray" />
        </span>
      </div>
      <div>
        <img className='object-contain w-10' src="https://avatar.talk.zdn.vn/default.jpg" alt="" />
      </div>
    </div>
  );
};

export default LoginBar;
