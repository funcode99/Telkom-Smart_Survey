import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { userProfile, userToken } from "./recoil";
import Pusher from "pusher-js";
import { setChannel } from "../utils/useChannel";
import { createActivity } from "./api/activityApi";

// import { db } from "./useFirebase"
// import { setDoc } from "firebase/firestore";
// import { doc } from "@firebase/firestore";

// Custom hooks to define if login success or fail, usage : {success, failed} = useLogin()
// If login success, you call a success function, success()
// If login failed, you call a failed function, failed()
// It will remove token on localStorage and redirect to login page.

// let fingerprint
// if (typeof navigator !== "undefined") {
//     const { ClientJS } = require('clientjs');
//     const client = new ClientJS();
//     console.log(client.getBrowserData())
//     fingerprint = client.getFingerprint();
// }

const useLogin = () => {
    const router = useRouter();
    const setToken = useSetRecoilState(userToken);
    const setProfile = useSetRecoilState(userProfile);


    if (typeof window === "undefined") return { success: null, failed: null };

    // profile is object of user profile data
    // token is object, {accessToken: string, refreshToken: string, isReady: boolean}
    // redirect is string "redirect", to make it easier don't use boolean true
    const success = (profile, token, redirect) => {
        window.localStorage.setItem("token", token.accessToken);
        if (token.refreshToken) {
            window.localStorage.setItem("refreshToken", token.refreshToken);
        }


        const pusher = new Pusher("102c2260d3604d322337", {
            cluster: "ap1",
        });


        if (profile.userId) {
            const channel = pusher.subscribe(profile.userId);
            setChannel(channel);
        }

        console.log(profile)
        setProfile(profile);
        setToken({
            accessToken: token.accessToken,
            isReady: true,
        })


        // send login log to service activity
        if (process.env.NODE_ENV !== "development") {
            const { userId, fullname, email, mobile } = profile
            createActivity({ event: "login", meta: { userId, fullname, email, mobile } })
        }

        // handle locale
        const tourState = window.localStorage.getItem("tourState");
        if (tourState) {
            const tourData = JSON.parse(tourState);
            if (!tourData[profile.userId]) {
                window.localStorage.setItem("tourState", JSON.stringify({ ...tourData, [profile.userId]: { home: false, modal_survey: false, button_question: false, modal_question: false } }));
            }
        } else {
            window.localStorage.setItem("tourState", JSON.stringify({ [profile.userId]: { home: false, modal_survey: false, button_question: false, modal_question: false } }));
        }

        if (redirect) router.replace(redirect);
    };

    const failed = () => {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refreshToken");

        setProfile({});
        setToken({ accessToken: null, isReady: true });
    };

    return { success, failed };
};

export default useLogin;
