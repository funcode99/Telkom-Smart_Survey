import { axios, token } from "./axios";
import { source, setSource } from "./cancelToken";

export const getAllRole = (args) => {
    if (source) source.cancel();
    const { level, page = 1, row = 10 } = args;

    setSource(axios.CancelToken.source());
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/api/roles/v1/lists?row=${row}&page=${page}&param={"level":"${level}"}`, {
                headers: { Authorization: `Bearer ${token()}` },
                cancelToken: source.token,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                if (axios.isCancel(error)) return console.log("cancelRequest");
                if (error.response?.data.code === 404) resolve({ lists: [], totalCount: 0 });
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const createRole = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/api/roles/v1/create`, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                console.log(response);
                resolve(response.data.data);
            })
            .catch((error) => {
                if (error.response?.data.code === 404) resolve({ lists: [], totalCount: 0 });
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const updateRole = (args, id) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/api/roles/v1/${id}`, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                if (error.response?.data.code === 404) resolve([]);
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};
