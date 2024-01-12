import { axios, token } from "./axios";

export const getAllQuestion = (args) => {
    const { level, userId } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/question${level === "admin" ? `?createdBy=${userId}` : ""}`, {
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

export const getQuestionBank = (args) => {
    const { page = 1, row = 20, category = "all", search = "" } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/question-bank?row=${row}&page=${page}${search ? `&search=${search}` : ""}${category === "all" ? "" : `&category=${category}`}`, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                if (error.response?.data.code === 404) resolve({ lists: [] });
                console.log(error.response);
                reject(error?.response?.data?.message || "Network error.");
            });
    });
};

export const createQuestion = (args) => {
    console.log(args)
    let newData = args;


    if (!["option", "radio", "checkbox"].includes(args.inputType)) {
        const oldData = { ...args };
        delete oldData.option;

        if (args.inputType !== "range") {
            delete oldData.min
            delete oldData.max
            delete oldData.minLabel
            delete oldData.maxLabel
        }
        if (args.inputType === "input-text") {
            oldData.typeData = "text";
        }

        newData = oldData;

    } else {
        const oldData = { ...args };
        delete oldData.min
        delete oldData.max
        delete oldData.minLabel
        delete oldData.maxLabel

        const option = args.option.map((option) => {
            let optionData = { label: option.label, value: option.value, point: option.point || 0, skipTo: option.skipTo || 0, optionImage: option.optionImage || "", isCustom: option.isCustom };
            if (option.optionImage?.includes("https://")) {
                delete optionData.optionImage
            }

            return optionData
        });
        newData = { ...oldData, option };
    }

    console.log(newData);
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + "/smart-survey/v1/question-to-survey", newData, {
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

export const editQuestion = (args, id) => {
    let newData = args;

    if (!["option", "radio", "checkbox"].includes(args.inputType)) {
        const oldData = { ...args };
        delete oldData.option;

        if (args.inputType !== "range") {
            delete oldData.min
            delete oldData.max
            delete oldData.minLabel
            delete oldData.maxLabel
        }
        if (args.inputType === "input-text") {
            oldData.typeData = "text";
        }

        newData = oldData;

    } else {
        const oldData = { ...args };
        delete oldData.min
        delete oldData.max
        delete oldData.minLabel
        delete oldData.maxLabel

        const option = args.option.map((option) => {
            let optionData = { label: option.label, value: option.value, point: option.point || 0, skipTo: option.skipTo || 0, optionImage: option.optionImage || "", isCustom: option.isCustom };
            // if (option.optionImage?.includes("https://")) {
            //     delete optionData.optionImage
            // }

            return optionData
        });
        newData = { ...oldData, option };
    }

    console.log(newData)
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_API_URL + "/smart-survey/v1/question/" + id, newData, {
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

export const deleteQuestion = (args) => {
    const { id } = args;
    return new Promise((resolve, reject) => {
        axios
            .delete(process.env.NEXT_PUBLIC_API_URL + "/smart-survey/v1/question/" + id, {
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

export const cloneQuestion = (args) => {
    console.log(args)
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_API_URL + `/smart-survey/v1/question/clone-questions`, args, {
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