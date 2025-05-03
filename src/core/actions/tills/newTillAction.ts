import { BackendApi } from "@/core/api/api";

export interface TillActionRequirements {
  name: string;
  storeId: string;
  bills: { [key: string]: number };
  type: string;
  admin: boolean;
}

export const NewTillAction = async ({
  name,
  storeId,
  bills,
  type,
  admin,
}: TillActionRequirements) => {
  try {
    const { data } = await BackendApi.post("/till/create", {
      name,
      storeId,
      bills,
      type,
      admin,
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};
