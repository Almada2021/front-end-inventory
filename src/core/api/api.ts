import axios from "axios";
const token = localStorage.getItem("token");
export const BackendApi = axios.create({
  baseURL: "http:localhost:8000",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Beares ${token}`,
  },
});
