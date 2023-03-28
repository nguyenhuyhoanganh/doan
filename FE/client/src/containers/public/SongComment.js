import { useContext, useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { SkeletonComment } from "../../components";
import * as apis from "../../apis";
import { AuthContext } from "../../contexts/auth.context";
import { getAccessTokenFromLocalStorage } from "../../utils/auth";

let stompClient = null;
const SongComment = ({ songId }) => {
  const [useSkeleton, setUseSkeleton] = useState(false);
  const { profile, isAuthenticated } = useContext(AuthContext);
  const [comments, setComments] = useState(null);
  const [inputComment, setInputComment] = useState("");
  // const handleComment
  useEffect(() => {
    const fetchComment = async () => {
      const res = await apis.apiGetComment({ limit: 40 }, songId);
      setComments(res?.data?.data);
    };
    fetchComment();
    connect();
  }, [songId]);

  const connect = () => {
    let socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);
    stompClient.connect({}, onConnected, onError);
  };
  const onConnected = () => {
    if (stompClient) {
      stompClient.subscribe(`/song/${songId}/comments`, onSubcribe);
      profile && stompClient.subscribe(`/user/${profile.id}/error`, onError);
    }
  };
  const onError = () => null;
  const onSubcribe = (payload) => {
    const payloadData = JSON.parse(payload.body);
    setComments((prev) => [...prev, payloadData]);
  };
  const handleSendComment = () => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (stompClient !== null && inputComment !== "" && accessToken !== "") {
      const body = { content: inputComment, song: { id: songId } };

      const headers = { Authorization: "Bearer " + accessToken };
      stompClient.send(`/comment/send`, { ...headers }, JSON.stringify(body));
      setInputComment("");
    }
  };
  // const handleSendComment = () => {

  // }
  return (
    <div className="flex flex-col w-full">
      <div className="w-[60%] h-[500px] flex gap-5 flex-col">
        <h1 className="font-extrabold text-[30px] text-[#0D7373]">Bình Luận</h1>
        <div className="flex flex-col w-auto mx-10 gap-2">
          {/* list bình luận */}
          {useSkeleton
            ? [1, 2, 3, 4].map((item, index) => {
                return <SkeletonComment key={index} className="w-[100%]" />;
              })
            : comments
            ? comments?.map((comment, index) => {
                return (
                  <div key={index} className="flex">
                    <img src=""></img>
                    <div className="flex flex-col">
                      <h1 className="text-[20px] font-semibold">Name</h1>
                      <span>{comment.content}</span>
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
      {isAuthenticated ? (
        <div className="flex gap-1">
          <input
            value={inputComment}
            onChange={(e) => {
              setInputComment(e.target.value);
            }}
            className="w-full h-10 border border-gray-300 rounded-md focus:outline-none p-1 focus:border-gray-500"
          />
          <button
            onClick={handleSendComment}
            type="submit"
            className="border min-w-[80px] rounded-md cursor-pointer hover:bg-main-400 border-red-500 ml-2"
          >
            Bình luận
          </button>
        </div>
      ) : (
        <span>Bạn cần đăng nhập để bình luận</span>
      )}

    </div>
  );
};

export default SongComment;
