import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import * as apis from "../../apis";
import { Scrollbars } from "react-custom-scrollbars-2";
import List from "../../components/List";

const Art_Com = () => {
  const { slug, id } = useParams();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState(null);
  const [useSkeleton, setUseSkeleton] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setUseSkeleton(true);
      const res = await apis.apiGetArtistBySlug(slug);
      const res2 = await apis.apiGetSongsByArtistId(id);
      if (res.data?.code === 200) {
        setArtist(res.data?.data[0]);
      }
      if (res2.data?.code === 200) {
        setSongs(res2.data?.data);
      }
      setUseSkeleton(false);
    };
    fetchData();
  }, []);
  return (
    <div className="flex gap-4 w-full px-[40px]">
      {useSkeleton ? (
        <div className="w-[30%] h-[280px] bg-gray-500 animate-pulse flex  "></div>
      ) : (
        <div className="flex-none w-[30%] flex flex-col items-center gap-2">
          <img
            className="object-contain rounded-md w-full shadow-md"
            // src={artist?.avatarUrl}
            src={
              artist
                ? "avataUrl" in artist
                  ? artist?.avatarUrl
                  : artist?.backgroundImageUrl
                : ""
            }
            alt="thumbnailM"
          ></img>
          <h3 className="text-[20px] text-center font-semibold">
            {artist?.fullName}
          </h3>
          {/* <span>{artist?.description}</span> */}
          {/* <span>
          <span>Theo dõi: {artist?.followCount}</span>
          <span></span>
        </span> */}
        </div>
      )}

      <div className="flex-auto flex flex-col gap-5 h-screen">
        <h1 className="font-semibold text-[24px]">
          {/* {playlistData?.description} */}
        </h1>
        {/* playlist */}
        <Scrollbars className="pl-5" style={{ width: "100%", height: 510 }}>
          {useSkeleton ? (
            [1, 2, 3, 1, 1, 1].map((el, index) => (
              <div
                key={index}
                className="group flex relative gap-6 cursor-pointer h-[50px] hover:shadow-2xl bg-gray-500 animate-pulse border border-main-400F w-[100%] rounded-lg justify-between items-center pr-[10px]"
              ></div>
            ))
          ) : (
            <List songs={songs} />
          )}
        </Scrollbars>
      </div>
    </div>
  );
};

export default Art_Com;
