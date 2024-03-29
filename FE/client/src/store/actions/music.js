import actionTypes from "./actionTypes";
import * as apis from "../../apis";
export const setCurSongId = (sid) => ({
  type: actionTypes.SET_CUR_SONG_ID,
  sid,
});

export const play = (flag) => ({
  type: actionTypes.PLAY,
  flag,
});

export const playAlbum = (flag) => ({
  type: actionTypes.SET_ALBUM,
  flag,
});

export const setPlaylistData = (songs) => ({
  type: actionTypes.PLAYLIST,
  songs,
});

export const setAutoSkip = (flag) => ({
  type: actionTypes.SKIP,
  flag,
});
export const setPreSongs = (song) => ({
  type: actionTypes.SET_PRE_SONGS,
  song,
  // send objiect action
});
// export const fetchDetailPlaylist = (pid) => async (dispatch) => {
//     try {
//         const res = await apis.apiGetDetailPlaylist(pid)
//         if(res?.data.err === 0){
//             dispatch({
//                 type: actionTypes.PLAYLIST,
//                 songs: res.data?.data?.song?.items
//             })
//         }

//     } catch (error) {
//         dispatch({
//             type: actionTypes.PLAYLIST,
//             songs: null,
//         })
//     }
// }
