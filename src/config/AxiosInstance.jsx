import Axios from "axios";

const AxiosInstance = Axios.create({
  baseURL: `https://api.leuteriorealty.com/natcon/v1/public/api/`,
  // baseURL: "http://localhost:8000/api/",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

export default AxiosInstance;
