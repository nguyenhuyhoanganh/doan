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
    <div className="w-full h-screen relative flex flex-col bg-main-200 overflow-hidden scroll-smooth">
      <div className="w-full h-full flex flex-auto ">
        <div className="w-[240px] h-full flex-none border border-blue-500">
          <SidebarLeft />
        </div>
        <div className="flex-auto">
          <div className="h-[70px] px-[59px] flex items-center mb-5">
            <Header />
          </div>
          <Outlet></Outlet>
          {/*  sinh ra các element nằm trong route con */}
        </div>
        <div className="w-[329px] h-screen hidden 1500:flex flex-none animate-slide-left border-[5px] border-l-red-500">
          <SidebarRight />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-[#C0D8D8]">
        <Player />
      </div>
    </div>
  );
};

export default Public;
