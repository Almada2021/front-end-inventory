import { BackendApi } from "@/core/api/api";
import { User } from "@/infrastructure/interfaces/user/user.interface";

export const getUserByIdAction = async (id: string) => {
  try {
    const { data } = await BackendApi.get<User>(`auth/user/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
