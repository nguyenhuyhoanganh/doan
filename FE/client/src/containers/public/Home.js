import React, { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import {
  Header,
  Slider,
  SkeletonComment,
  Skeleton,
  SkeletonCard,
  SkeletonSlider,
  SkeletonSong,
} from "../../components";
import HomeContainer from "../../components/HomeContainer";
import { useDispatch } from "react-redux";
import * as actions from "../../store/actions";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth.context";

const Home = ({ useSkeleton }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  if (isAuthenticated) {
    dispatch(actions.getPlaylistName());
  }

  return (
    <Scrollbars className="pl-5" style={{ width: "100%", height: 560 }}>
      <div className="overflow-y-auto">
        {/* <div className="h-[70px] px-[59px] flex items-center">
        <Header />
      </div> */}
        <Slider />
        <div className="flex flex-col gap-5 h-auto p-5 pt-10">
          <HomeContainer />
        </div>
      </div>
    </Scrollbars>
  );
};

export default Home;
