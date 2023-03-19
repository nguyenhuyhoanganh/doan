// luu State gia tri lien quan den app
import actionTypes from "../actions/actionTypes";
const initState = {
  banner: [],
  // new songs
  friday: [],
  top10: []
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
    default:
      return state;
  }
};
export default appReducer;
