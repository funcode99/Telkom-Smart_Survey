import { axios, token } from "./axios";

export const getAllItem = () => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_VOUCHER_URL + "/api/v1/item", {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                if (error.response?.data.code === 404) resolve([]);
                console.log(error);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const checkBilling = (billingId) => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_VOUCHER_URL + "/api/pub/v1/billing/" + billingId, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {

                console.log("wallet s", token())
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const createBilling = (args, source) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_VOUCHER_URL + "/api/pub/v1/billing" + source, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                if (axios.isCancel(error)) return console.log("cancelRequest");
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};


export const getWallet = (userId) => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_VOUCHER_URL + "/api/pub/v1/wallet/" + userId, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                if (error.response?.data.code === 401) reject("expired");
                if (error.response?.data.code === 404) resolve({ balance: 0 });
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const getTransactionHistory = (args) => {
    const { userId, page = 1, row = 20 } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/transaction/${userId}?row=${row}&page=${page}&sort=newest`, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                if (error.response?.data.code === 404) resolve({ list: [], totalData: 0 });
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const getListBilling = (args) => {
    const { userId, page = 1, row = 20 } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_VOUCHER_URL + `/api/pub/v1/billing/list/${userId}?row=${row}&page=${page}&sort=newest`, {
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

export const transferPoint = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/transaction/transfer-point`, args, {
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

export const setRewardSurvey = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/transaction/set-reward-survey`, args, {
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

export const buySubscription = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/transaction/buy-subscription`, args, {
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


export const refundPoint = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/transaction/refund-point`, args, {
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

export const refundVoucher = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/transaction/refund-reward-survey`, args, {
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

export const redeemVoucher = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_VOUCHER_URL + `/api/pub/v1/voucher/reedem-voucher`, args, {
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

export const getAllItemExchange = (args) => {
    const { page = 1, row = 10, sort = "newest", userId, status, itemName, isExpired = "false", isAvailable = "true", isPublic } = args

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_VOUCHER_URL + `/api/v1/item-exchange?row=${row}&page=${page}&sort=${sort}${itemName ? `&itemName=${itemName}` : ""}${status ? `&status=${status}` : ""}${userId ? `&userId=${userId}` : ""}${isExpired ? `&isExpired=${isExpired}` : ""}${isAvailable ? `&isAvailable=${isAvailable}` : ""}${isPublic !== null ? `&isPublic=${isPublic}` : ""}`, {
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

export const addItemExchange = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_VOUCHER_URL + `/api/v1/item-exchange`, args, {
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

export const updateItemExchange = (args, itemId) => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_VOUCHER_URL + `/api/v1/item-exchange/${itemId}`, args, {
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

export const deleteItemExchange = (itemId) => {
    return new Promise((resolve, reject) => {
        axios
            .delete(process.env.NEXT_PUBLIC_VOUCHER_URL + `/api/v1/item-exchange/${itemId}`, {
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

export const exchangePoint = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_VOUCHER_URL + `/api/pub/v1/exchange/exchange-point`, args, {
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

export const getAllVoucher = (args) => {
    const { page = 1, row = 10, sort = "newest", isReedemed } = args

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_VOUCHER_URL + `/api/pub/v1/exchange/voucher?row=${row}&page=${page}&sort=${sort}&isReedemed=${isReedemed}&isAvailable=true`, {
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

export const redeemVoucherExchange = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_VOUCHER_URL + `/api/v1/exchange/reedem-voucher`, args, {
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