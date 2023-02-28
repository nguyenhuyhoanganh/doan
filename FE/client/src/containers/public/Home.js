import React, { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Header, Slider } from "../../components";
import HomeContainer from "../../components/HomeContainer";

const Home = () => {
  return (
    <Scrollbars className="pl-5" style={{ width: "100%", height: 560 }}>
      <div className="overflow-y-auto">
        {/* <div className="h-[70px] px-[59px] flex items-center">
        <Header />
      </div> */}
        <Slider />
        <div className="h-auto p-5">
          <HomeContainer />
        </div>
      </div>
    </Scrollbars>
  );
};

export default Home;
