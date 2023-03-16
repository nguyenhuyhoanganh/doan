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
  const [songs, setSongs] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      const res = await apis.apiGetArtistBySlug(slug);
      const res2 = await apis.apiGetSongsByArtistId(id)
      if (res.data?.code === 200) {
        setArtist(res.data?.data[0]);
      }
      if(res2.data?.code === 200){
        setSongs(res2.data?.data)
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex gap-4 w-full px-[40px]">
      <div className="flex-none w-[30%] flex flex-col items-center gap-2">
        <img
          className="object-contain rounded-md w-full shadow-md"
          src={artist?.avatarUrl}
          alt="thumbnailM"
        ></img>
        <h3 className="text-[20px] text-center font-semibold">
          {artist?.fullName}
        </h3>
        {/* <span>{artist?.description}</span> */}
        <span>
          <span>Theo dõi: {artist?.followCount}</span>
          <span></span>
        </span>
      </div>
      <div className="flex-auto flex flex-col gap-5 h-screen">
        <h1 className="font-semibold text-[24px]">
          {/* {playlistData?.description} */}
        </h1>
        {/* playlist */}
        <Scrollbars className="pl-5" style={{ width: "100%", height: 510 }}>
          <List songs={songs} />
        </Scrollbars>
      </div>
    </div>
  );
};

export default Art_Com;
