import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../store/actions";
import { useNavigate } from "react-router-dom";
import { SkeletonSlider } from "./";

// const { banner } = useSelector(state => state.app)
var fakeWaitAPI
const getArrSlider = (start, end, number) => {
  const limit = start > end ? number : end;
  let output = [];
  for (let i = start; i <= limit; i++) {
    output.push(i);
  }
  if (start > end) {
    for (let i = 0; i <= end; i++) {
      output.push(i);
    }
  }
  return output;
};

const Slider = () => {
  const [skeleton, setSkeleton] = useState(null);
  const dispatch = useDispatch(); // redux
  const { banner } = useSelector((state) => {
    // console.log(state)

    return state.app;
  });
  const getSlider = () => {
    console.log("ok slider");
    setSkeleton(false);
    fakeWaitAPI && clearTimeout(fakeWaitAPI);
  };
  useEffect(() => {
    fakeWaitAPI = setTimeout(getSlider, 4000);
    // fakeWaitAPI
    setSkeleton(true); 
  }, []);
  useEffect(() => {
    const sliderEls = document.getElementsByClassName("slider-item");
    let min = 0;
    let max = 2;
    const intervalId = setInterval(() => {
      const list = getArrSlider(min, max, sliderEls.length - 1);
      for (let i = 0; i < sliderEls.length; i++) {
        // Delete classnames (css)
        sliderEls[i]?.classList?.remove(
          "animate-slide-right",
          "order-last",
          "z-20"
        );
        sliderEls[i]?.classList?.remove(
          "animate-slide-left",
          "order-first",
          "z-10"
        );
        sliderEls[i]?.classList?.remove(
          "animate-slide-left2",
          "order-2",
          "z-10"
        );

        // Hide or Show images
        if (list.some((item) => item === i)) {
          sliderEls[i].style.cssText = `display: block`;
        } else {
          sliderEls[i].style.cssText = `display: none`;
        }
      }
      // Add animation by adding classnames
      list.forEach((item) => {
        if (item === max) {
          sliderEls[item]?.classList?.add(
            "animate-slide-right",
            "order-last",
            "z-20"
          );
        } else if (item === min) {
          sliderEls[item]?.classList?.add(
            "animate-slide-left",
            "order-first",
            "z-10"
          );
        } else {
          sliderEls[item]?.classList?.add(
            "animate-slide-left2",
            "order-2",
            "z-10"
          );
        }
      });
      min = min === sliderEls.length - 1 ? 0 : min + 1;
      max = max === sliderEls.length - 1 ? 0 : max + 1;
    }, 5000);
    return () => {
      intervalId && clearInterval(intervalId);
    };
  }, []);
  const navigate = useNavigate();
  const handleClickBanner = (item) => {
    // console.log(item);
    if (item?.type === 1) {
      // is song get id stored in localStorage
      dispatch(actions.setCurSongId(item.encodeId));
      dispatch(actions.play(true));
      dispatch(actions.setPlaylistData(null));
    } else if (item?.type === 4) {
      console.log(item);
      // link = /album/Nhac-Moi-Moi-Ngay-Sam-Smith-Vu-Cat-Tuong-STAYC-Hoang-Thuy-Linh/67WIO6CF.html
      const albumPath = item?.link?.split(".")[0];
      // console.log(albumPath)
      //chuyển qua trang album

      navigate(albumPath);
    } else {
      dispatch(actions.setPlaylistData(null));
    }
  };

  return (
    <div className="w-full overflow-hidden px-[59px]">
      {console.log(skeleton)}
      {skeleton ? (
        <SkeletonSlider />
      ) : (
        <div className="flex w-full gap-8 pt-8">
          {banner?.map((item, index) => (
            <img
              key={item.encodeId}
              src={item.banner}
              onClick={() => handleClickBanner(item)}
              className={`slider-item flex-1 object-contain w-[30%] rounded-lg ${
                index <= 2 ? "block" : "hidden"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
