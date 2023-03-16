import React, { useEffect, useState } from "react";
import * as apis from "../../apis";
import List from "../../components/List";
import handleDuration from "../../utils/formatDuration";
import { Scrollbars } from "react-custom-scrollbars-2";

const Chart = () => {
  const [listChart, setListChart] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const res = await apis.getChart();
      if (res.data?.code === 200) {
        setListChart(res?.data.data);
        console.log(listChart);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-col bg-main-200 h-full w-full p-5">
      <h1 className="font-extrabold text-[30px] text-[#0D7373]">#CHART</h1>
      <Scrollbars style={{ width: "100%", height: 540 }}>
        <div className="flex flex-col pr-8">
          {/* Mỗi thẻ div là 1 bài hát */}
          {listChart &&
            listChart.map((element, index) => {
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
                        {element.title}
                      </span>
                      <span className="text-sm text-[#171e1e]">
                        {element.artists[0].fullName}
                      </span>
                    </div>
                  </div>
                  <span>Lượt nghe: {element.view}</span>
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
