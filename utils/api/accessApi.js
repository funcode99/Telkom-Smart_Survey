import { axios, token } from "./axios";

export const getAllAccess = (args) => {
    const { userId, level = "admin" } = args;
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/access${level !== "super" ? `?userId=${userId}` : ""}`, {
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

export const createAccess = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + "/smart-survey/v1/access", args, {
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

export const updateAccess = (args, accessId) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/access/${accessId}`, args, {
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

export const setSurveyAccess = (args, accessId) => {
    console.log(args, accessId);
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/access/${accessId}/set-survey`, args, {
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

export const removeSurveyAccess = (args, accessId) => {
    console.log(args, accessId);
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/access/${accessId}/remove-survey`, args, {
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

export const deleteAccess = (accessId) => {
    return new Promise((resolve, reject) => {
        axios
            .delete(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/access/${accessId}`, {
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
