import { axios, token } from "./axios";

export const registerMerchant = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_VOUCHER_URL + "/api/pub/v1/merchant", args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const getAllMerchant = (args) => {
    const { row = 10, page = 1, sort = "newest", status } = args

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_VOUCHER_URL + `/api/pub/v1/merchant?row=${row}&page=${page}&sort=${sort}&status=${status}`, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                if (error.response?.data.code === 404) resolve({ lists: [], totalData: 0 });
                console.log(error);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};


export const setStatusMerchant = (args, merchantId) => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_VOUCHER_URL + `/api/v1/merchant/${merchantId}/status`, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};
