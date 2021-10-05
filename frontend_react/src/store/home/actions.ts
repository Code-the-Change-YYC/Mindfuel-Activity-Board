export const addUser = (socketData: MessageEvent) => {
    return {
        type: "ADD_USER",
        socketData: socketData
    }
}