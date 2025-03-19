import { BackendApi } from "@/core/api/api";
import { UsersResponse } from "@/infrastructure/interfaces/user/user.interface";

export const getAllEmployeesAction  = async () => {
    try {
        const employees = await BackendApi.get<UsersResponse>("/auth/all")
        return employees.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}