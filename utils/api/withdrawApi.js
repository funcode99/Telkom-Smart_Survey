import { axios, token } from "./axios";
let source;

export const getAllWithdraw = (args) => {
    if (source) source.cancel();
    const { row = 10, page = 1, sort = "newest", status } = args

    source = axios.CancelToken.source();
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_VOUCHER_URL + `/api/pub/v1/withdraw?row=${row}&page=${page}&sort=${sort}&status=${status}`, {
                headers: { Authorization: `Bearer ${token()}` },
                cancelToken: source.token,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                if (axios.isCancel(error)) return console.log("cancelRequest");
                if (error.response?.data.code === 404) resolve({ lists: [], totalData: 0 });
                console.log(error);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const requestWithdraw = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_VOUCHER_URL + "/api/pub/v1/withdraw", args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const setStatusWithdraw = (args, withdrawId) => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_VOUCHER_URL + `/api/v1/withdraw/${withdrawId}/status`, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};