// luu State gia tri lien quan den app
import actionTypes from "../actions/actionTypes"
const initState = {
    curSongId: null,
    isPlaying: false,
    atAlbum: false,
    songs: [],
}

const musicReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.SET_CUR_SONG_ID:{
            return {
                ...state,
                curSongId: action.sid || null
            }
        }
        case actionTypes.PLAY:{
            return {
                ...state,
                isPlaying: action.flag
            }
        }
        case actionTypes.SET_ALBUM:{
            return {
                ...state,
                atAlbum: action.flag
            }
        }
        case actionTypes.PLAYLIST:{
            return {
                ...state,
                songs: action.songs
            }
        }
        default:
            return state
    }
}
export default musicReducer