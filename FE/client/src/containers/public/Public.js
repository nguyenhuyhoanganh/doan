import React from "react";
import { Outlet } from "react-router-dom";
import {
  SidebarLeft,
  SidebarRight,
  Player,
  Header
} from "../../components";

const Public = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-main-200">
      <div className="w-full h-full flex flex-auto">
        <div className="w-[240px] flex-none border border-blue-500">
          <SidebarLeft />
        </div>
        <div className="flex-auto border border-yellow-500">
          <div className="h-[70px] px-[59px] flex items-center">
            <Header />
          </div>
          <Outlet></Outlet>
          {/*  sinh ra các element nằm trong route con */}
        </div>
        <div className="w-[329px] hidden 1500:flex flex-none border border-red-500 animate-slide-left">
          <SidebarRight />
        </div>
      </div>
      <div className="flex-none h-[90px] bg-[#C0D8D8]">
        <Player />
      </div>
    </div>
  );
};

export default Public;
