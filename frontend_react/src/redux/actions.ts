import { User } from "../utils/User"

export const addUser = (user: User) => {
    return {
        type: "ADD_USER",
        user: user
    }
}