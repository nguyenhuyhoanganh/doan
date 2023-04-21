import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Line } from "react-chartjs-2";
import { Chart, Tooltip } from "chart.js/auto";
import { useQuery } from "@tanstack/react-query";
import {
  NavLink,
  createSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { BsPauseCircle, BsPlayFill } from "react-icons/bs";
import { BiLoader } from "react-icons/bi";
import { isEqual } from "lodash";
import { chart } from "../apis";
import useQueryParams from "../hooks/useQueryParams";
import Popover from "./Popover";
import * as icons from "../utils/icons"
import * as actions from "../store/actions"
import { useDispatch } from "react-redux";
import { Item} from "../components"

const ChartSection = () => {
  const {TbPlayerTrackNext} = icons;
  // data hiển thị lên Line
  const [chartData, setChartData] = useState(null);
  // lấy ra các query param trên url
  const queryParams = useQueryParams();
  // lưu topSongs
  const [topSongs, setTopSongs] = useState(null);
  // index của bài hát đang được hover trên line (topSongs)
  const [songIndexHover, setSongIndexHover] = useState(null);
  // lưu hiển thị tooltip khi hover vào line
  const [isShowTooltip, setIsShowTooltip] = useState(false);
  // vị trí của tooltip so với điểm hover
  const [tooltipState, setTooltipState] = useState({
    opacity: 0,
    top: 0,
    left: 0,
  });
  // ref để check chart đã được tạo hay chưa
  const chartRef = useRef();

  // fetch api
  const { data } = useQuery({
    queryKey: ["chart", { top: queryParams.top || 10 }],
    queryFn: () => {
      return chart(queryParams.top || 10);
    },
    keepPreviousData: true,
  });
  const hour = new Date().getHours();
  
  useEffect(() => {
    if (data !== undefined) {
      // labels và datasets là dữ liệu Line
      const labels = data?.data.data.labels.map((item) =>
        (+item + hour + 1) % 2 === 0
          ? item < 10
            ? `0${item}:00`
            : `${item}:00`
          : ""
      );
      // bộ dữ liệu hiển thị chart
      // [{data: [124, 4543, 342]}, {data: [...]}, ...]
      const datasets = data?.data.data.datasets
        .filter((_, index) => index < 3)
        .map((data, index) => ({
          ...data,
          borderColor:
            index === 0 ? "#4a90e2" : index === 1 ? "#50e3c2" : "#e35050",
          tension: 0.2,
          borderWidth: 2,
          pointHoverRadius: 5,
          pointBackgroundColor: "white",
          pointHitRadius: 4,
          pointBorderColor:
            index === 0 ? "#4a90e2" : index === 1 ? "#50e3c2" : "#e35050",
          animation: false,
          pointHoverBorderWidth: 3,
        }));
      // tổng count của 3 bái top đầu
      const totalCount = data?.data.data.datasets.reduce(
        (total, data, index) => {
          return index < 3 ? total + data.data[23] : total + 0;
        },
        0
      );
      // lấy ra top song
      const top_songs = data?.data.data.top_songs.reduce(
        (topSongs, song, index) => {
          return index < 2
            ? [
                ...topSongs,
                {
                  ...song,
                  // thêm trường rank vào từng phần tử song của topSongs
                  rank: index + 1,
                  // với 2 phần tử 0, 1 tính % dựa theo totalCount
                  percent: Math.round(
                    (data?.data.data.datasets[index].data[23] / totalCount) *
                      100
                  ),
                },
              ]
            : index === 2
            ? [
                ...topSongs,
                {
                  ...song,
                  rank: index + 1,
                  // với phần tử 2 lấy 100% trừ đi
                  percent:
                    100 -
                    Math.round(
                      (data?.data.data.datasets[0].data[23] / totalCount) * 100
                    ) -
                    Math.round(
                      (data?.data.data.datasets[1].data[23] / totalCount) * 100
                    ),
                },
              ]
            : // với bài hát ngoài top 3 chỉ có thêm trường rank, không có percent
              [...topSongs, { ...song, rank: index + 1 }];
        },
        []
      );
      setTopSongs(top_songs);
      setChartData({ labels, datasets });
    }
  }, [data, hour]);
  // options của Line
  const options = {
    responsive: true,
    pointRadius: 0,
    // aspectRatio: 2.5,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: { display: false },
        grid: { color: "rgba(255, 255, 255, 0.3)", drawTicks: false },
        border: { dash: [3, 4] },
        min: 0,
        max: 250,
      },
      x: {
        ticks: { color: "gray" },
        grid: { color: "transparent" },
      },
    },
    plugins: {
      legend: false,
      tooltip: {
        enabled: false,
        external: ({ tooltip }) => {
          if (!chartRef || !chartRef.current) return;
          if (tooltip.opacity === 0) {
            if (tooltipState.opacity !== 0)
              setTooltipState((prev) => ({ ...prev, opacity: 0 }));
            return;
          }
          const color = tooltip?.labelColors[0]?.borderColor;
          const index = color === "#4a90e2" ? 0 : color === "#50e3c2" ? 1 : 2;
          setSongIndexHover(index);
          const newTooltipState = {
            opacity: 1,
            left: tooltip.caretX,
            top: tooltip.caretY,
          };
          if (!isEqual(tooltipState, newTooltipState))
            setTooltipState(newTooltipState);
        },
      },
    },
    hover: {
      mode: "dataset",
      intersect: false,
    },
  };
  // bg-gradient-to-t from-[#34224f]/90 to-[#34224f]/70
  return (
    <div className="relative h-[400px] w-[96%] rounded-md bg-cover bg-center bg-chart-image">
      {/* <img className='absolute inset-0 z-10 rounded-md' src='/src/imgs/chart.jpg' alt='bg-chart'></img> */}
      <div className="absolute inset-0 rounded-md bg-[rgba(0,0,0,0.6)]"></div>
      <div className="absolute inset-0 rounded-md p-4">
        <div className="grid h-full grid-cols-12 gap-4">
          <h3 className="col-span-12 block text-2xl font-bold text-white">
            #Rating today
          </h3>
          <div className="col-span-5 flex flex-col gap-4">
            {/** vị trí hiển thị 3 bài hát top đầu */}
            {topSongs && topSongs.map((song, index) => (index < 3 ? <Item song={song} key={index} /> : null))}
          </div>
          <div className="relative col-span-7 h-full">
            {chartData !== null && (
              <Line data={chartData} ref={chartRef} options={options} />
            )}
            {songIndexHover !== null && topSongs && (
              <div
                className={`group h-4 w-4 rounded-full bg-transparent ${
                  isShowTooltip === true ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  top: tooltipState.top - 8,
                  left: tooltipState.left - 8,
                  position: "absolute",
                }}
              >
                {/* <Item song={topSongs[songIndexHover]} isTooltip={true} /> topSongs[songIndexHover].title*/}
                <Popover
                  placement="top"
                  trigger="hover"
                  shrinkedPopoverPosition="bottom"
                  renderPopover={<div>{topSongs[songIndexHover].title}</div>}
                  offsetValue={{ mainAxis: 7, crossAxis: 0 }}
                  delayHover={{
                    open: 0,
                    close: 0,
                  }}
                  onOpenChange={(isOpen) => setIsShowTooltip(isOpen)}
                >
                  <div
                    className={`absolute z-50 flex h-4 w-4 items-center justify-center rounded-full 
              ${isShowTooltip === true ? "bg-white" : "bg-transparent"}`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isShowTooltip === true
                          ? songIndexHover === 0
                            ? "bg-[#4a90e2]"
                            : songIndexHover === 1
                            ? "bg-[#50e3c2]"
                            : "bg-[#e35050]"
                          : "bg-transparent"
                      }`}
                    ></div>
                  </div>
                </Popover>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
