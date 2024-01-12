
import axiosInstance from "axios"
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { createActivity } from "./activityApi";


const refreshToken = (failedRequest) => {

    if (typeof window === "undefined") return;
    console.log("Access Token expired, getting new token ...");
    let refresh_token = window.localStorage.getItem("refreshToken");
    const params = new URLSearchParams();
    params.append("refresh_token", refresh_token);
    params.append("grant_type", "refresh_token");

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/api/users/v1/token/oauth`, params, {
                auth: {
                    username: "app-ihz-smartsurvey",
                    password: "smartsurvey",
                },
                skipAuthRefresh: true,
            })
            .then((response) => {
                console.log(response);
                const data = response.data.data;
                window.localStorage.setItem("token", data.accessToken);
                window.localStorage.setItem("refreshToken", data.refreshToken);
                failedRequest.response.config.headers["Authorization"] = "Bearer " + data.accessToken;
                resolve();
            })
            .catch((error) => {
                console.log(error.response);

                createActivity({
                    event: "login-failed", meta: {
                        step: "refresh-token",
                        token: token,
                        refreshToken: refresh_token,
                        message: error?.response?.data?.message || "Network error."
                    }
                })

                window.localStorage.removeItem("token");
                window.localStorage.removeItem("refreshToken");
                window.location.replace("/login");
                reject(error);
            });
    });
};

createAuthRefreshInterceptor(axiosInstance, refreshToken, {
    statusCodes: [401], pauseInstanceWhileRefreshing: true
});

export const axios = axiosInstance
export const token = () => {
    if (typeof window !== "undefined") return window.localStorage.getItem('token');
}