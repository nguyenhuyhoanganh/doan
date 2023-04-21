import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { List } from "../../components";
import Scrollbars from "react-custom-scrollbars-2";
import { AuthContext } from "../../contexts/auth.context";
import { toast } from "react-toastify";
import * as apis from "../../apis";
import getCurrentDate from "../../utils/currentDate";

const AiPlaylist = () => {
  const { allsongs } = useSelector((state) => state.app);
  const [fvList, setFvList] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);
  const [favoristeList, setFavoristList] = useState([]);
  const { preSongs } = useSelector((state) => state.music);

  console.log(preSongs);
  useEffect(() => {
    const fetchFVL = async () => {
      if (isAuthenticated) {
        const res = await apis.apiGetFavoritePlaylist({
          limit: 999,
          orderBy: "createdAt",
        });
        setFavoristList(res?.data?.data);
      }
    };
    fetchFVL();
  }, []);

  const handleCreatePlaylist = () => {
    const findLengthOneHotVec = (songs) => {
      let maxGenre = -1;
      let maxId = -1;
      for (const song of songs) {
        if (maxGenre <= song.album.id) {
          maxGenre = song.album.id;
        }
        if (maxId <= song.artists[0].id) {
          maxId = song.artists[0].id;
        }
      }
      return { maxGenre: maxGenre, maxId: maxId };
    };
    const createVec = (id, max) => {
      const vec = new Array(max).fill(0);
      vec[id - 1] = 1;
      return vec;
    };
    const createVecUser = (id, max) => {
      const vec = new Array(max).fill(0);
      vec[id - 1] = 0.1;
      return vec;
    };

    const createInput = (songs) => {
      const X = [];
      const { maxGenre, maxId } = findLengthOneHotVec(songs);
      for (const song of songs) {
        const vec1 = createVec(song.artists[0].id, maxId);
        const vec2 = createVec(song.album.id, maxGenre);
        X.push([song.id, ...vec1, ...vec2]);
      }
      return X;
    };
    // Tạo song features
    const X = createInput(allsongs);

    const euclideanLength = (vector) => {
      let sum = 0;
      for (let i = 0; i < vector.length; i++) {
        sum += vector[i] * vector[i];
      }
      return Math.sqrt(sum);
    };
    // Hàm tính cosine similarity của hai vector
    const cosineSimilarity = (vector1, vector2) => {
      // Chuẩn hóa các vector về dạng vector đơn vị
      const length1 = euclideanLength(vector1);
      const length2 = euclideanLength(vector2);
      for (let i = 0; i < vector1.length; i++) {
        vector1[i] /= length1;
      }
      for (let i = 0; i < vector2.length; i++) {
        vector2[i] /= length2;
      }

      // Tính tích vô hướng của hai vector chuẩn hóa
      let dotProduct = 0;
      for (let i = 0; i < vector1.length; i++) {
        dotProduct += vector1[i] * vector2[i];
      }

      // Đồng nhất kết quả
      return dotProduct;
    };
    // const userFeatures = [
    //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0, 0.1, 0, 0.1, 0, 0, 0, 0, 0, 0, 0, 0,
    //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0,
    //   0.6, 0,
    // ];

    const createUserFeatures = (fvList, preSongs, songs) => {
      const userFeatures = [];
      const { maxGenre, maxId } = findLengthOneHotVec(songs);
      for (const s of fvList) {
        const vecComposer = createVecUser(s.artists[0]?.id, maxId);
        const vecGenres = createVecUser(s.album.id, maxGenre);
        userFeatures.push([...vecComposer, ...vecGenres]);
      }
      if (preSongs.length > 0) {
        for (const preSong of preSongs) {
          const vecComposer = createVecUser(preSong.artists[0]?.id, maxId);
          const vecGenres = createVecUser(preSong.album.id, maxGenre);
          userFeatures.push([...vecComposer, ...vecGenres]);
        }
      }
      // console.log(userFeatures)
      const sumColumns = (matrix) => {
        const numRows = matrix.length;
        const numCols = matrix[0].length;
        const sums = Array(numCols).fill(0);

        for (let col = 0; col < numCols; col++) {
          for (let row = 0; row < numRows; row++) {
            sums[col] += matrix[row][col];
          }
        }

        return sums;
      };
      const sum = sumColumns(userFeatures);
      const userFeature = sum.map((val) => (val > 1 ? 1 : val));
      return userFeature;
    };
    const userFeatures = createUserFeatures(favoristeList, preSongs, allsongs);
    const genderPlaylist = (userFeatures, songFeatures) => {
      const cosin = [];
      for (const x of songFeatures) {
        // console.log(x)
        const similarity = cosineSimilarity(userFeatures, x.slice(1));
        cosin.push(similarity);
      }
      var indices = Array.from({ length: cosin.length }, (_, index) => index);
      indices.sort(function (a, b) {
        if (cosin[a] > cosin[b]) {
          return -1; // Sử dụng -1 để sắp xếp không tăng
        } else if (cosin[a] < cosin[b]) {
          return 1; // Sử dụng 1 để sắp xếp không tăng
        } else {
          return 0;
        }
      });
      const favoristeList = [];
      for (let i = 0; i < 10; i++) {
        favoristeList.push(allsongs[indices[i]]);
      }
      setFvList(favoristeList);
      return {
        cosin: cosin.sort(function (a, b) {
          return b - a;
        }),
        indices: indices,
      };
    };
    if (isAuthenticated) {
      const { cosin, indices } = genderPlaylist(userFeatures, X);
    } else {
      toast.warning("Bạn phải đăng nhập trước!!!");
    }
  };
  const handleAproval = () => {
    // console.log(fvList);
    const currentDate = getCurrentDate();
    const fetchCreatePL = async () => {
      const res = await apis.apiCreatePlaylist({
        title: `Favoriste Playlist ${currentDate}`,
        slug: `favoriste_playlist_${currentDate.replace(/\s+/g, "_")}`,
        status: "PUBLIC",
      });
      if (res?.data?.code === 201) {
        for (let song of fvList) {
          await apis.apiAddSongToPlaylist(song.id, res?.data?.data?.id);
        }
        toast.warning("Tạo playlist thành công");
      } else {
        toast.warning("Tạo plalist không thành công!!!");
      }
    };
    fetchCreatePL();
  };
  return (
    <div className="flex flex-col p-3 text-center gap-8 m-auto">
      <h1 className="text-[24px] font-bold text-[#0D7373]">
        Tạo playlist theo sở thích của bạn
      </h1>
      <marquee className="text-[20px] text-[#0D7373]">
        Tạo giúp bạn một playlist nhạc phù hợp với sở thích nghe nhạc của bạn
      </marquee>
      <div className="flex gap-2 w-[100%]">
        <div className="w-[30%] flex flex-col h-[200px] items-center justify-center gap-2 ">
          {/* <h1>Tên playlist</h1>
          <input type="text" className="w-[80%] rounded-md p-2 focus:outline-none focus:border-[#0D7373]"></input> */}
          <div
            onClick={handleCreatePlaylist}
            className="px-2 py-2 border border-[#0D7373] rounded-md hover:bg-main-400 w-[50%] cursor-pointer"
          >
            Tạo thử
          </div>
          {fvList.length !== 0 && (
            <div
              onClick={handleAproval}
              className="px-2 py-2 border border-[#0D7373] rounded-md hover:bg-main-400 w-[50%] cursor-pointer"
            >
              Tạo playlist này
            </div>
          )}
        </div>
        <div className="w-[70%] h-[200px] text-left">
          {fvList.length !== 0 && (
            <Scrollbars className="pl-5" style={{ width: "100%", height: 400 }}>
              <List songs={fvList}></List>
            </Scrollbars>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiPlaylist;
