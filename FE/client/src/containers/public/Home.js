import React, { useEffect } from "react";

import { Header, Slider } from "../../components";
import HomeContainer from "../../components/HomeContainer"

const Home = () => {
  return (
    <div className="overflow-y-auto">
      {/* <div className="h-[70px] px-[59px] flex items-center">
        <Header />
      </div> */}
      <Slider />
      <div className="border border-red-500 h-auto p-5">
        <HomeContainer/>
      </div>
    </div>
  );
};

export default Home;
