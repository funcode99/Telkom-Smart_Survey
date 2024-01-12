import { axios } from "./axios";

export const getActivity = (args) => {
    const { event, params } = args

    return new Promise((resolve, reject) => {
        axios
            .post(`https://api-activity-dev.mysiis.io/api/activity/v1/get-data`, { event, params }, {
                auth: {
                    username: "app-ihz-smartsurvey",
                    password: "a63zaCaXw4atuDzOUQPR",
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

export const createActivity = (args) => {
    const { event, meta } = args

    return new Promise((resolve, reject) => {
        axios
            .post(`https://api-activity-dev.mysiis.io/api/activity/v1`, { event, meta }, {
                auth: {
                    username: "app-ihz-smartsurvey",
                    password: "a63zaCaXw4atuDzOUQPR",
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
