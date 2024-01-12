import { axios, token } from "./axios";
import { source, setSource } from "./cancelToken";

export const getAllUser = (args) => {
    if (source) source.cancel();
    const { level, status, page = 1 } = args;

    setSource(axios.CancelToken.source());
    return new Promise((resolve, reject) => {
        axios
            .get(
                process.env.NEXT_PUBLIC_API_URL +
                `/smart-survey/v1/user?row=10&page=${page}&param={"level":"${level}","status":"${status}"}`,
                {
                    headers: { Authorization: `Bearer ${token()}` },
                    cancelToken: source.token,
                }
            )
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

export const searchUser = (args) => {
    if (source) source.cancel();
    const { level, status, keyword, row = 5, page = 1 } = args;

    setSource(axios.CancelToken.source());
    return new Promise((resolve, reject) => {
        axios
            .get(
                process.env.NEXT_PUBLIC_API_URL +
                `/smart-survey/v1/user?row=${row}&page=${page}&param={"level":"${level}","status":"${status}","$or":[{"email":{"$regex":"${keyword}", "$options": "i"}},{"fullname":{"$regex":"${keyword}", "$options": "i"}}]}`,
                {
                    headers: { Authorization: `Bearer ${token()}` },
                    cancelToken: source.token,
                }
            )
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

export const registerUser = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/user/register-by-admin`, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                console.log(response);
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const updateUser = (args, userId) => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/user/${userId}`, args, {
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

export const deleteUser = (userId) => {
    return new Promise((resolve, reject) => {
        axios
            .delete(
                process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/user/${userId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token()}` },
                }
            )
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

export const verifyUser = (userId) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/user/${userId}/verify-admin`,
                { admin_verified: true },
                {
                    headers: { Authorization: `Bearer ${token()}` },
                }
            )
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const rejectUser = (id) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.REACT_APP_API_URL + `/smart-survey/v1/${id}/reject-admin`,
                { admin_rejected: true },
                {
                    headers: { Authorization: `Bearer ${token()}` },
                }
            )
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error?.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const automaticApproval = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/user/automatic-approval`, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                console.log(error?.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};
