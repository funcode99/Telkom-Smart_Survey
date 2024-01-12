import { axios, token } from "./axios";

export const getAllAnswer = (args) => {
    const { surveyId, page = 1, row = 2 } = args;
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/answer?row=${row}&page=${page}&sort=newest&surveyId=${surveyId}`, {
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

export const getAnswer = (answerId) => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/answer/${answerId}`, {
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

export const deleteAnswer = (answerId) => {
    return new Promise((resolve, reject) => {
        axios
            .delete(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/answer/${answerId}`, {
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

export const getUserAnswer = (args) => {
    const { userId, page = 1, row = 7 } = args;
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/answer/get-by-user/${userId}?row=${row}&page=${page}&sort=newest`, {
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

export const getSummaryResult = (args) => {
    const { surveyId, startDate, endDate } = args

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/answer/summary-result/${surveyId}${startDate ? `?startDate=${startDate}&endDate=${endDate}` : ""}`, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                if (error.response?.data.code === 404) resolve({ questions: [] });
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const getSummaryResultQuiz = (surveyId) => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/answer/summary-result-quiz/${surveyId}`, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                if (error.response?.data.code === 404) resolve({ questions: [] });
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const createAnswer = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + "/smart-survey/v1/answer", args, {
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

export const createAnswerAnonymous = (args) => {
    console.log(args)
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + "/smart-survey/v1/answer/anonymous", args, {
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
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const deleteAnswerBySurvey = (surveyId) => {
    return new Promise((resolve, reject) => {
        axios
            .delete(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/answer/delete-by-survey/${surveyId}`, {
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
