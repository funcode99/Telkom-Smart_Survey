import { atom } from "recoil";

export const firebaseAnalytic = atom({
    key: "firebaseAnalytic",
    default: null,
});
export const firebaseFirestore = atom({
    key: "firebaseFirestore",
    default: null,
});
export const firebaseMessaging = atom({
    key: "firebaseMessaging",
    default: null,
});

export const userProfile = atom({
    key: "userProfile",
    default: {},
});

export const userWallet = atom({
    key: "userWallet",
    default: {
        value: null,
        state: null,
    },
});

export const userToken = atom({
    key: "userToken",
    default: {
        accessToken: null,
        isReady: false,
    },
});

export const userChannel = atom({
    key: "userChannel",
    default: null,
});

export const userLocale = atom({
    key: "userLocale",
    default: "id",
});

export const modalState = atom({
    key: "modalState",
    default: {},
});

export const shareState = atom({
    key: "shareSurvey",
    default: { surveyId: "", groups: "", key: null },
});

export const notification = atom({
    key: "notification",
    default: [],
});
