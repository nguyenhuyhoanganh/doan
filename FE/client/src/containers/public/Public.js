import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarLeft, SidebarRight, Player } from "../../components";

const Public = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-[#CED9D9]">
      <div className="w-full h-full flex flex-auto">
        <div className="w-[240px] flex-none border border-blue-500">
          <SidebarLeft />
        </div>
        <div className="flex-auto border border-yellow-500">
          <Outlet></Outlet>
        </div>
        <div className="w-[329px] flex-none border border-red-500">
          <SidebarRight />
        </div>
      </div>
      <div className="flex-none h-[90px] bg-[#C0D8D8]">
        <Player/>
      </div>
    </div>
  );
};

export default Public;
