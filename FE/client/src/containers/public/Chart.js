import React, { useEffect, useState } from "react";
import * as apis from "../../apis";
import List from "../../components/List";
import handleDuration from "../../utils/formatDuration";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useSelector } from "react-redux";
import ChartSection from "../../components/ChartSection";
import useQueryParams from "../../hooks/useQueryParams";
import { useQuery } from "@tanstack/react-query";

const Chart = () => {
  const { chart } = useSelector((state) => state.app);
  const [topSongs, setTopSongs] = useState([]);
  const [topListen, setTopListen] = useState([]);
  const queryParams = useQueryParams();
  const { data } = useQuery({
    queryKey: ["chart", { top: queryParams.top || 10 }],
    queryFn: () => {
      return chart(queryParams.top || 10);
    },
    keepPreviousData: true,
  });
  console.log(data);

  useEffect(() => {
    if (data !== undefined) {
      setTopSongs(data?.data?.data?.top_songs);
      const luotNghe = data?.data?.data?.datasets;
      const topListen = [];
      for (const dataset of luotNghe) {
        const total = dataset.data.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        // console.log(total)
        topListen.push(total);
      }
      setTopListen(topListen);
    }
  }, [data]);
  return (
    <div className="flex flex-col bg-main-200 gap-5 h-full w-full p-5">
      <h1 className="font-extrabold text-[30px] text-[#0D7373]">#CHART</h1>
      <Scrollbars style={{ width: "100%", height: 460, zIndex: 1000 }}>
        <ChartSection />
        <div className="flex flex-col pr-8">
          {/* Mỗi thẻ div là 1 bài hát */}
          {topSongs.length > 0 &&
            topSongs.map((element, index) => {
              return (
                <div
                  key={index}
                  className="flex gap-5 justify-between p-1 rounded-lg text-[#0D7373] hover:text-[#fff] border border-[#629898] hover:bg-main-400 mt-5 items-center cursor-pointer hover:shadow-lg"
                >
                  <div className="flex gap-6 w-[50%] items-center">
                    <h1 className="text-[24px] font-semibold pl-2">
                      {index + 1}
                    </h1>
                    <img
                      src={element.imageUrl}
                      className="w-12 h-12 object-cover rounded-md ml-4"
                    />
                    <div className="flex flex-col gap-1 pl-2">
                      <span className="font-bold text-[#111010]">
                        {element.title.length <= 30 ? element.title : `${element.title.slice(0, 30)}....`}
                      </span>
                      <span className="text-sm text-[#171e1e]">
                        {element.artists[0].fullName}
                      </span>
                    </div>
                  </div>
                  <span>Lượt nghe: {topListen[index]}</span>
                  <span>Lượt thích: {element.likeCount}</span>
                  <span>{handleDuration(element.duration)}</span>
                </div>
              );
            })}
        </div>
      </Scrollbars>
    </div>
  );
};

export default Chart;
