import { State } from "../../utils/State";

const initialState: State = {
  liveUsers: [],
};

const userReducer = (state: State | undefined = initialState, action: any) => {
  switch (action.type) {
    case "ADD_USER":
      console.log("User added: ", action.user);
      return {
        ...state,
        liveUsers: [
          ...state.liveUsers,
          action.user
        ]
      };
    default:
      return state;
  }
};

export default userReducer;
