import { BackendApi } from "@/core/api/api";
import { UsersResponse } from "@/infrastructure/interfaces/user/user.interface";

export const getAllUsersAction = async () => {
    try {
        const users = await BackendApi.get<UsersResponse>("auth/all");
        if (!users) {
            throw new Error("No users found");
        }
        return users.data
    } catch (error) {
        console.log(error);
        throw error;
    }
}