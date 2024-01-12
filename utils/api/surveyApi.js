import { axios, token } from "./axios";
import { source, setSource } from "./cancelToken";
let searchSurveySource;
let searchStoreSource;


export const getAllSurvey = (args) => {
    if (args.menu === "my_library") return getTemplateLibrary(args);

    if (source) source.cancel();
    const { level, userId, row = 10, page = 1, query = "usergroup", sort = "newest", menu, categoryId, groupId, search, isVerified } = args;


    setSource(axios.CancelToken.source());
    return new Promise((resolve, reject) => {
        axios
            .get(
                process.env.NEXT_PUBLIC_API_URL +
                `/v1/smart-survey?row=${row}&page=${page}&sort=${sort}${level !== "super" ? `&${query}=${query === "groupId" ? groupId : userId}` : ""
                }${categoryId && categoryId !== "all" ? "&categoryId=" + categoryId : ""}${menu ? menu === "draft" ? "&status=draft" : "&status=final" : ""}${search ? "&search=" + search : ""
                }${isVerified ? "&isVerified=true" : ""}`,
                {
                    headers: { Authorization: `Bearer ${token()}` },
                    cancelToken: source.token,
                }
            )
            .then((response) => {
                console.log("survey s", token());
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log("survey", token());
                if (axios.isCancel(error)) return console.log("cancelRequest");
                if (error?.response?.data?.code === 404) resolve({ lists: [], totalData: 0 });
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const getTemplateLibrary = (args) => {
    if (source) source.cancel();
    const { userId, row = 12, page = 1, sort = "newest", search } = args;

    setSource(axios.CancelToken.source());
    return new Promise((resolve, reject) => {
        axios
            .get(
                process.env.NEXT_PUBLIC_API_URL +
                `/smart-survey/v1/template/${userId}?row=${row}&page=${page}&sort=${sort}${search ? "&search=" + search : ""}`,
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
                if (error?.response?.data?.code === 404) resolve({ list: [], totalData: 0 });
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const getSurvey = (surveyId) => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/v1/smart-survey/" + surveyId, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data || {});
            })
            .catch((error) => {
                if (error?.response?.data?.code === 404) reject("not-found");
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};


export const getAllSurveyPublic = (args) => {
    if (source) source.cancel();
    const { row = 6, page = 1, sort = "newest", categoryId, isVerified, share = "all", search, disableCancel } = args;

    setSource(axios.CancelToken.source());
    return new Promise((resolve, reject) => {
        axios
            .get(
                process.env.NEXT_PUBLIC_API_URL +
                `/v1/pub/smart-survey?row=${row}&page=${page}&sort=${sort}${categoryId && categoryId !== "all" ? "&categoryId=" + categoryId : ""}${isVerified ? "&isVerified=true" : ""}${share ? `&isSelling=${share}` : ""}${search ? `&search=${search}` : ""}`,
                {
                    auth: { username: process.env.NEXT_PUBLIC_AUTH_USERNAME, password: process.env.NEXT_PUBLIC_API_PASSWORD },
                    cancelToken: !disableCancel && source.token,
                }
            )
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                if (axios.isCancel(error)) return console.log("cancelRequest");
                if (error?.response?.data?.code === 404) resolve({ lists: [], totalData: 0 });
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const getSurveyPublic = (surveyId) => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/v1/pub/smart-survey/" + surveyId, {
                auth: { username: process.env.NEXT_PUBLIC_AUTH_USERNAME, password: process.env.NEXT_PUBLIC_API_PASSWORD },
            })
            .then((response) => {
                resolve(response.data.data || {});
            })
            .catch((error) => {
                if (error?.response?.data?.code === 404) reject("not-found");
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const searchSurvey = (args) => {
    if (searchSurveySource) searchSurveySource.cancel();
    const { userId, level, row = 3, page = 1, sort = "newest", search } = args;

    searchSurveySource = axios.CancelToken.source()
    return new Promise((resolve, reject) => {
        axios
            .get(
                process.env.NEXT_PUBLIC_API_URL +
                `/v1/smart-survey?row=${row}&page=${page}&sort=${sort}&search=${search}${level === "super" ? "" : `&usergroup=${userId}`}`,
                {
                    headers: { Authorization: `Bearer ${token()}` },
                    cancelToken: searchSurveySource.token,
                }
            )
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log("survey", token());
                if (axios.isCancel(error)) return console.log("cancelRequest");
                if (error?.response?.data?.code === 404) resolve({ lists: [], totalData: 0 });
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const searchStore = (args) => {
    if (searchStoreSource) searchStoreSource.cancel();
    const { row = 3, page = 1, sort = "newest", share = "all", search } = args;

    searchStoreSource = axios.CancelToken.source()
    return new Promise((resolve, reject) => {
        axios
            .get(
                process.env.NEXT_PUBLIC_API_URL +
                `/v1/pub/smart-survey?row=${row}&page=${page}&sort=${sort}&search=${search}&isSelling=${share}`,
                {
                    auth: { username: process.env.NEXT_PUBLIC_AUTH_USERNAME, password: process.env.NEXT_PUBLIC_API_PASSWORD },
                    cancelToken: searchStoreSource.token,
                }
            )
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                if (axios.isCancel(error)) return console.log("cancelRequest");
                if (error?.response?.data?.code === 404) resolve({ lists: [], totalData: 0 });
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const takeSurvey = (surveyId) => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + `/v1/smart-survey/${surveyId}/take`, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data || {});
            })
            .catch((error) => {
                if (error?.response?.data?.code === 404) reject("not-found");
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const createSurvey = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + "/v1/smart-survey", args, {
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

export const editSurvey = (args, surveyId) => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_API_URL + "/v1/smart-survey/" + surveyId, args, {
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

export const deleteSurvey = (args) => {
    const { id } = args;
    return new Promise((resolve, reject) => {
        axios
            .delete(process.env.NEXT_PUBLIC_API_URL + "/v1/smart-survey/" + id, {
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

export const submitSurvey = (surveyId) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_API_URL + `/v1/smart-survey/${surveyId}/submit-survey`,
                {},
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

export const verifySurvey = (surveyId) => {
    console.log(token);
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_API_URL + `/v1/smart-survey/${surveyId}/verify-survey`,
                {},
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

export const unverifySurvey = (surveyId) => {
    console.log(token);
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_API_URL + `/v1/smart-survey/${surveyId}/unverify-survey`,
                {},
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

export const combineSurvey = (args) => {
    const { destination, source } = args;
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_API_URL + "/v1/smart-survey/survey-combine",
                { surveyIdDestination: destination, surveyIdSources: [source] },
                {
                    headers: { Authorization: `Bearer ${token()}` },
                }
            )
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error.response);
                reject(error?.response?.data || error);
            });
    });
};

export const setGroupSurvey = (args, surveyId) => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_API_URL + `/v1/smart-survey/${surveyId}/set-group`, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error?.response);
                reject(error?.response?.data || error);
            });
    });
};

export const removeGroupSurvey = (args, surveyId) => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_API_URL + `/v1/smart-survey/${surveyId}/remove-group`, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error?.response);
                reject(error?.response?.data || error);
            });
    });
};

export const setNumOfSort = (args, surveyId) => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_API_URL + `/v1/smart-survey/${surveyId}/set-num-of-sort`, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error?.response);
                reject(error?.response?.data || error);
            });
    });
};

export const buyTemplate = (args) => {
    console.log(args);
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + "/smart-survey/v1/transaction/buy-template", args, {
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

export const cloneSurvey = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + "/v1/smart-survey/clone-survey", args, {
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
