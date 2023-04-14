// luu State gia tri lien quan den app
import actionTypes from "../actions/actionTypes";
const initState = {
  banner: [],
  // new songs
  friday: [],
  top10: [],
  chart: [],
  artists: [],
  composers: [],
  allsongs: [],
};

const appReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.GET_HOME: {
      return {
        ...state, 
        banner:
          action.homeData || null,
      };
    }
    case actionTypes.GET_NEW_RELEASE: {
      return {
        ...state, 
        friday:
          action.newReleaseData || null,
      };
    }
    case actionTypes.GET_TOP_10: {
      return {
        ...state, 
        top10:
          action.top10 || null,
      };
    }
    case actionTypes.GET_CHART: {
      return {
        ...state, 
        chart:
          action.chart || null,
      };
    }
    case actionTypes.GET_ARTIST: {
      return {
        ...state, 
        artists:
          action.artists || null,
      };
    }
    case actionTypes.GET_COMPOSER: {
      return {
        ...state, 
        composers:
          action.composers || null,
      };
    }
    case actionTypes.GET_ALL_SONG: {
      return {
        ...state, 
        allsongs:
          action.allsongs || null,
      };
    }
    default:
      return state;
  }
};
export default appReducer;
