import { axios, token } from "./axios";

export const getAllCategory = (args) => {
    const { page = 1, row = 100 } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/category?row=${row}&page=${page}`, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                if (error.response?.data.code === 404) resolve({ lists: [], totalData: 0 });
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};
