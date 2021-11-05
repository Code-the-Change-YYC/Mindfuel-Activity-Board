import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import ApiService from "../api/ApiService";
import rootReducer from "./reducer";

const store = createStore(
  rootReducer,
  compose(
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk.withExtraArgument(ApiService))
  )
);

export default store;
