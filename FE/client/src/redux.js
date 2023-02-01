import rootReducer from "./store/reducer/rootReducer";
import { createStore, applyMiddleware } from "redux";
// configureStore replace createStore?
import thunk from "redux-thunk";


const reduxConfig = () => {
    const store = createStore(rootReducer, applyMiddleware(thunk))
    return store
}

export default reduxConfig