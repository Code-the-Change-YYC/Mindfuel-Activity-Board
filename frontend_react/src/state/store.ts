import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import ApiService from "../api/ApiService";
import rootReducer from "./reducer";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk.withExtraArgument(ApiService)))
);

export default store;

export type AppDispatch = typeof store.dispatch;
