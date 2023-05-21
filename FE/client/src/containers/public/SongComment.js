import { useContext, useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { SkeletonComment } from "../../components";
import * as apis from "../../apis";
import { AuthContext } from "../../contexts/auth.context";
import { getAccessTokenFromLocalStorage } from "../../utils/auth";
import Scrollbars from "react-custom-scrollbars-2";
import formatTime from "../../utils/formatTime";
import sensitiveWords from "../../utils/sensitiveWords";
import { toast } from "react-toastify";

let stompClient = null;
const SongComment = ({ songId }) => {
  const [useSkeleton, setUseSkeleton] = useState(false);
  const { profile, isAuthenticated, setProfile } = useContext(AuthContext);
  const [comments, setComments] = useState(null);
  const [inputComment, setInputComment] = useState("");
  const [violationTime, setViolationTime] = useState(1);

  const checkSensitiveWords = (comment, sensitiveWords) => {
    const words = comment.split(" ");
    for (let i = 0; i < words.length; i++) {
      if (sensitiveWords.includes(words[i])) {
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    const fetchComment = async () => {
      setUseSkeleton(true);
      const res = await apis.apiGetComment(
        { limit: 40, orderBy: "createdAt" },
        songId
      );
      setComments(res?.data?.data.reverse());
      setUseSkeleton(false);
      console.log(profile);
      if ("violationCount" in profile) {
        setViolationTime(profile.violationCount);
      }
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
      const regex = new RegExp(sensitiveWords.join("|"), "gi");
      const filteredComment = inputComment.replace(regex, (match) =>
        "*".repeat(match.length)
      );
      const flag = checkSensitiveWords(inputComment, sensitiveWords);
      if (flag) {
        // cảnh cáo và đánh gậy
        const fetchViolation = async (uid) => {
          const res = await apis.violation(uid);
          const res2 = await apis.infoUser(uid);
          toast.warning(
            `Bình luận của bạn chứa từ không phù hợp cảnh báo lần ${
              violationTime + 1
            }/10`
          );
          setProfile(res2?.data?.data);
          setViolationTime((pre) => pre + 1);
        };
        fetchViolation(profile.id);
      } else {
      }
      const body = { content: filteredComment, song: { id: songId } };

      const headers = { Authorization: "Bearer " + accessToken };
      stompClient.send(`/comment/send`, { ...headers }, JSON.stringify(body));
      setInputComment("");
    }
  };
  return (
    <div className="flex flex-col w-full">
      <div className="w-[100%] h-[500px] flex gap-5 flex-col">
        <h1 className="font-extrabold text-[30px] text-[#0D7373] w-full flex">
          Bình Luận
        </h1>
        <Scrollbars style={{ width: "100%", height: 500 }}>
          <div className="flex flex-col w-auto mx-5 gap-2">
            {/* list bình luận */}
            {useSkeleton
              ? [1, 2, 3, 4].map((item, index) => {
                  return <SkeletonComment key={index} className="w-[100%]" />;
                })
              : comments
              ? comments?.map((comment, index) => {
                  return (
                    <div
                      key={index}
                      className="flex gap-8 items-center justify-between w-full"
                    >
                      <div className="flex gap-5">
                        <img
                          className="w-10 h-auto object-contain"
                          src={
                            comment?.createdBy?.avatarUrl
                              ? comment?.createdBy?.avatarUrl
                              : "https://avatar.talk.zdn.vn/default.jpg"
                          }
                        ></img>
                        <div className="flex flex-col border border-gray-400 px-2 rounded-md">
                          <h1 className="text-[18px] font-semibold">
                            {comment?.createdBy?.lastName
                              ? `${comment?.createdBy?.lastName} ${
                                  comment?.createdBy?.firstName
                                } ${
                                  profile.id === comment?.createdBy?.id
                                    ? "(Bạn)"
                                    : ""
                                }`
                              : comment?.createdBy?.email}
                          </h1>
                          <span>{comment.content}</span>
                        </div>
                      </div>
                      <span>{formatTime(comment?.createdAt)}</span>
                    </div>
                  );
                })
              : ""}
          </div>
        </Scrollbars>
      </div>
      {isAuthenticated ? (
        <div className="flex gap-1">
          <input
            placeholder="bình luận gì đó ...."
            value={inputComment}
            onChange={(e) => {
              setInputComment(e.target.value);
            }}
            className="w-full h-10 py-5 border border-gray-300 rounded-md focus:outline-none px-1 focus:border-[#0D7373]"
          />
          {violationTime >= 10 ? (
            <button
              title="Bạn bị cấm bình luận vì sử dụng nhiều từ nhạy cảm"
              type="submit"
              className="border min-w-[80px] rounded-md cursor-not-allowed bg-gray-400 border-[#0D7373] ml-2"
            >
              Bình luận
            </button>
          ) : (
            <button
              onClick={handleSendComment}
              type="submit"
              className="border min-w-[80px] rounded-md cursor-pointer hover:bg-main-400 border-[#0D7373] ml-2"
            >
              Bình luận
            </button>
          )}
        </div>
      ) : (
        <span>Bạn cần đăng nhập để bình luận</span>
      )}
    </div>
  );
};

export default SongComment;
