import { BackendApi } from "@/core/api/api";
import { User } from "@/infrastructure/interfaces/user/user.interface";

export const getEmployeeByIdAction  = async (id: string) => {
    try {
        const employee = await BackendApi.get<User>(`/auth/user/${id}`)
        return employee.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}