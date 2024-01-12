import { axios, token } from "./axios";

export const getAllGroup = (args) => {
    const { userId, page = 1, row = 10, level } = args;
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/group?row=${row}&page=${page}${level !== "super" ? `&userId=${userId}` : ""}`, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                if (axios.isCancel(error)) return console.log("cancelRequest");
                if (error.response?.data.code === 404) resolve({ lists: [], totalData: 0 });
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const createGroup = (args) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/group`, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const updateGroup = (args, groupId) => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/group/${groupId}`, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const deleteGroup = (groupId) => {
    return new Promise((resolve, reject) => {
        axios
            .delete(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/group/${groupId}`, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const setMember = (args, groupId) => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/group/${groupId}/set-member`, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const removeMember = (args, groupId) => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/group/${groupId}/remove-member`, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const setAdmin = (args, groupId) => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/group/${groupId}/set-admin`, args, {
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

export const removeAdmin = (args, groupId) => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/group/${groupId}/remove-admin`, args, {
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

export const registerApp = (args, groupId) => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/group/${groupId}/register-app`, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const removeApp = (args, groupId) => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/group/${groupId}/remove-app`, args, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                console.log(error);
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};
