// luu State gia tri lien quan den app
import actionTypes from "../actions/actionTypes";
const initState = {
  curSongId: null,
  isPlaying: false,
  atAlbum: false,
  songs: null,
  skip: true,
  preSongs: [],
  personnalPlaylist: [],
};

const musicReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.SET_CUR_SONG_ID: {
      return {
        ...state,
        curSongId: action.sid || null,
      };
    }
    case actionTypes.PLAY: {
      return {
        ...state,
        isPlaying: action.flag,
      };
    }
    case actionTypes.SET_ALBUM: {
      return {
        ...state,
        atAlbum: action.flag,
      };
    }
    case actionTypes.PLAYLIST: {
      return {
        ...state,
        songs: action.songs || null,
      };
    }
    case actionTypes.SKIP: {
      return {
        ...state,
        skip: action.flag,
      };
    }
    case actionTypes.GET_ALL_PLAYLIST_NAMES: {
      return {
        ...state,
        personnalPlaylist: action.myplaylist || null,
      };
    }
    case actionTypes.SET_PRE_SONGS: {
      if (state.preSongs.length == 0) {
        return {
          ...state,
          preSongs: [...state.preSongs, action.song],
        };
      } else {
        if (!state.preSongs.some((el) => el.id === state.curSongId)) {
          return {
            ...state,
            preSongs: [...state.preSongs, action.song],
          };
        } else {
            return {
                ...state,
                preSongs: [...state.preSongs],
              };
        }
      }
    }
    default:
      return state;
  }
};
export default musicReducer;
