import { axios } from "./axios";
import qs from "querystring";
import jwt_decode from "jwt-decode";
import jwt_valid from "jwt-valid"
import { createActivity } from "./activityApi";


export const getToken = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/api/users/v1/token/oauth`, qs.stringify(args), {
                auth: {
                    username: "app-ihz-smartsurvey",
                    password: "smartsurvey",
                },
                skipAuthRefresh: true,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                if (error?.response?.data?.code === 1008) {
                    console.log(error?.response?.data?.message);
                    reject("not-registered");
                } else {
                    reject(error?.response?.data?.message || "Network error.");
                }
            });
    });
};

export const getTokenGoogle = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/api/users/v1/token/google`, args, {
                auth: {
                    username: "app-ihz-smartsurvey",
                    password: "smartsurvey",
                },
                skipAuthRefresh: true,
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

export const getCurrentUser = (token) => {
    if (!jwt_valid(token)) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refreshToken");
        window.location.replace("/login");
        return createActivity({
            event: "login-failed", meta: {
                step: "token-undefined",
                token,
                message: "Token is not valid."
            }
        })
    }

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/user/${jwt_decode(token)?.user?.userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log(response)
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const createUser = (args) => {
    console.log(args)
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/user`, args, {
                auth: {
                    username: "telkom",
                    password: process.env.NEXT_PUBLIC_API_PASSWORD,
                },
                skipAuthRefresh: true,
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

export const sendOtp = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/user/send-otp`, args, {
                auth: {
                    username: "telkom",
                    password: process.env.NEXT_PUBLIC_API_PASSWORD,
                },
                skipAuthRefresh: true
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error?.response?.data?.message);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const verifyEmail = (args) => {
    console.log(args)
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/user/verify-email`, args, {
                auth: {
                    username: "telkom",
                    password: process.env.NEXT_PUBLIC_API_PASSWORD,
                },
                skipAuthRefresh: true,
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

export const getRegisterRole = () => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/api/roles/v1/pub/lists?row=10&page=1&param={"level":"user"}`, {
                auth: {
                    username: "app-ihz-smartsurvey",
                    password: "smartsurvey",
                },
                skipAuthRefresh: true,
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

export const getKey = (shareKey) => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/user/automatic-approval/` + shareKey, {
                auth: {
                    username: "telkom",
                    password: process.env.NEXT_PUBLIC_API_PASSWORD,
                },
                skipAuthRefresh: true,
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

export const forgotPassword = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/user/forgot-password`, args, {
                auth: {
                    username: "telkom",
                    password: process.env.NEXT_PUBLIC_API_PASSWORD,
                },
                skipAuthRefresh: true,
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

export const changePassword = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/user/change-password`, args, {
                auth: {
                    username: "telkom",
                    password: process.env.NEXT_PUBLIC_API_PASSWORD,
                },
                skipAuthRefresh: true,
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
