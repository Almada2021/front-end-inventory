import { BackendApi } from "@/core/api/api";
import { Client } from "@/infrastructure/interfaces/clients/clients.response";

export const getClientByIdAction = async (id: string) => {
    try {
        const client = await BackendApi.get<Client>(`/client/id/${id}`)
        return client.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}