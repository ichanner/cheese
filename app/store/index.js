import { createStore, applyMiddleware, compose } from "redux";
import { combineReducers } from "redux";
import thunk from "redux-thunk";
import wsMiddleware from "./middleware/socket";
import spanReducer from "./span/reducer"
import socketReducer from "./socket/reducer";

const reducers = combineReducers({span: spanReducer, socket: socketReducer});

var middlewares = [thunk, wsMiddleware];

export default createStore(reducers, applyMiddleware(...middlewares));