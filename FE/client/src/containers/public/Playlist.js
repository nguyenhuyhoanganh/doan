import React, { useState, useEffect } from "react";
import formatDate from "../../utils/formatDay";
import Scrollbars from "react-custom-scrollbars-2";
import { List } from "../../components";
import { useNavigate, useParams } from "react-router-dom";
import * as apis from "../../apis";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth.context";
import { toast } from "react-toastify";
import path from "../../utils/path";
import * as actions from "../../store/actions";
import icons from "../../utils/icons";
import { useDispatch } from "react-redux";

const Playlist = () => {
  const { pid } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const dispatch = useDispatch();
  const { AiOutlinePlayCircle } = icons;
  const [songs, setSongs] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const [useSkeleton, setUseSkeleton] = useState(false);
  const [btnSkeleton, setBtnSkeleton] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSongPlaylist = async (pid) => {
      setUseSkeleton(true);
      if (isAuthenticated) {
        const res = await apis.apiGetPlaylistById(pid);
        setSongs(res?.data?.data?.songs);
        setPlaylist(res?.data?.data);
      }
      setUseSkeleton(false);
    };
    fetchSongPlaylist(pid);
  }, []);
  const handleDeletePlaylist = () => {
    setIsShow(true);
    console.log(playlist);
  };
  const handleDelete = () => {
    let intervalId;
    setBtnSkeleton(true);
    const fetchDel = async (pid) => {
      const res = await apis.apiDeletePlaylist(pid);
      dispatch(actions.getPlaylistName());
      intervalId = setTimeout(() => {
        navigate(`/mymusic`);
        toast.success("Xóa thành công");
        setBtnSkeleton(false);
      }, 2000);
    };
    fetchDel(pid);
    intervalId && clearInterval(intervalId);
  };
  const handlePlayPL = () => {
    if (songs.length > 0) {
      dispatch(actions.setCurSongId(songs[0]?.id));
      dispatch(actions.play(true));
      dispatch(actions.playAlbum(true));
      dispatch(actions.setPlaylistData(songs));
    } else {
      toast.warning("Chưa có bài hát nào trong playlist");
    }
  };
  return (
    <div className="flex gap-4 w-full px-[40px] relative">
      {useSkeleton ? (
        <div className="flex-none h-[300px] w-[30%] flex bg-gray-500 animate-pulse"></div>
      ) : (
        <div className="flex-none w-[30%] flex flex-col items-center gap-2">
          <img
            className="object-contain rounded-md w-full shadow-md"
            src={
              songs.length !== 0
                ? songs[0].imageUrl
                : process.env.PUBLIC_URL + "/LOGO.png"
            }
            alt="thumbnailM"
          ></img>
          <h3 className="text-[20px] text-center font-semibold">
            {playlist?.title}
          </h3>
          {/* <span>{songs?.description}</span> */}
          <span>
            <span>Cập nhật: {formatDate(playlist?.createdAt)}</span>
            <span></span>
          </span>
          <button
            onClick={handleDeletePlaylist}
            className="border border-red-500 hover:bg-red-500 rounded-md px-2 py-1 cursor-pointer hover:text-[#fff]"
          >
            Xóa playlist
          </button>
          {isShow ? (
            <div className="fixed top-1/2 transform -translate-y-1/2 left-1/2 bg-main-300 p-2 -translate-x-1/2 h-auto w-[400px] border shadow-md rounded-lg z-10">
              <div className="flex flex-col justify-center gap-3 items-center ">
                <h1 className="font-extrabold text-[20px] text-[#0D7373] text-center">
                  Xóa playlist {playlist.title}
                </h1>
                <div className="flex gap-5 justify-center">
                  <button
                    disabled={btnSkeleton}
                    onClick={handleDelete}
                    className={`border border-red-500 hover:bg-red-500 rounded-md hover:text-[#fff] px-2 py-1 ${btnSkeleton? "cursor-wait" : "cursor-pointer"}`}
                  >
                    Xác nhận
                  </button>
                  <button
                    onClick={(e) => setIsShow(false)}
                    className="border border-[#0D7373] rounded-md hover:bg-main-400 hover:text-[#fff] cursor-pointer px-2 py-1"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      )}

      <div className="flex-auto flex flex-col gap-5 h-screen">
        <h1 className="font-semibold text-[24px]">
          {/* {playlistData?.description} */}
        </h1>
        {useSkeleton ? (
          <div
            onClick={handlePlayPL}
            className="px-2 py-1 rounded-md bg-gray-600 animate-pulse h-10 w-[30%]"
          ></div>
        ) : (
          <div
            onClick={handlePlayPL}
            className="flex gap-4 border text-center items-center justify-center hover:text-[#fff] text-[#0D7373] border-[#0D7373] px-2 py-1 cursor-pointer hover:bg-main-400 rounded-md w-[30%]"
          >
            <button className="">Phát playlist này</button>
            <AiOutlinePlayCircle size={30} />
          </div>
        )}

        {/* playlist */}
        {songs.length !== 0 ? (
          <Scrollbars className="pl-5" style={{ width: "100%", height: 460 }}>
            {useSkeleton ? (
              [1, 2, 3, 1, 1, 1, 1, 1, 1, 1].map((el, index) => (
                <div
                  key={index}
                  className="group flex relative gap-6 cursor-pointer h-[50px] hover:shadow-2xl bg-gray-500 animate-pulse border border-main-400F w-[100%] rounded-lg justify-between items-center pr-[10px]"
                ></div>
              ))
            ) : (
              <List songs={songs} />
            )}
          </Scrollbars>
        ) : (
          "Chưa có bài hát nào"
        )}
      </div>
    </div>
  );
};

export default Playlist;
