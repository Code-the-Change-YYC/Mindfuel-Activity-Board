const userReducer = (state = [], action: any) => {
  switch (action.type) {
    case "ADD_USER":
      console.log("User added: ", action.socketData);
      return state;
    default:
      return state;
  }
};

export default userReducer;
