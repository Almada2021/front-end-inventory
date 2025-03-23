import { BackendApi } from "@/core/api/api";

export const salesByDayDashboardAction = async (startDate: string, endDate: string) => {
  try {
    const sales = await BackendApi.get<{[key: string]: number}>(
      "/sale/dashboard",
      {
        params: {
          startDate,
          endDate,
        },
      }
    );
    return sales.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
