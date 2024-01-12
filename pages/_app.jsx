import { useEffect } from "react";
import { RecoilRoot } from "recoil";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import PropTypes from "prop-types";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import { getCurrentUser } from "../utils/api/authApi";
import { useRecoilValue } from "recoil";
import { userToken } from "../utils/recoil";
import useLogin from "../utils/useLogin";
import { createActivity } from "../utils/api/activityApi";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { setAnalytic } from "../utils/useFirebase";

import "../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import "spinners-react/lib/SpinnerCircular.css";

// If compiling take loooooonger time, we have 2 suggestions
// First, reinstall your Windows
// Second, uninstall Windows and use Linux
// We recommend you to use second option, because Windows is sucks !

const firebaseConfig = {
    apiKey: "AIzaSyDAlrU-xiFMDLwQ-C7pePbrDhu0k6ZDfFI",
    authDomain: "smartsurvey-5b775.firebaseapp.com",
    projectId: "smartsurvey-5b775",
    storageBucket: "smartsurvey-5b775.appspot.com",
    messagingSenderId: "665993613302",
    appId: "1:665993613302:web:63cba213abd50a10e681d7",
    measurementId: "G-05PXDH5D2H",
};

const App = (props) => {
    const { success, failed } = useLogin();
    const tokenRecoil = useRecoilValue(userToken);
    const router = useRouter();

    const app = initializeApp(firebaseConfig);
    const analytic = typeof window !== "undefined" ? getAnalytics(app) : () => null;

    useEffect(() => {
        if (typeof window === "undefined") return;

        router.events.on("routeChangeStart", () => {
            document.body.style.overflow = "auto";
        });

        setAnalytic(analytic);

        const locale = window.localStorage.getItem("locale");
        if (locale) {
            if (locale !== router.locale) {
                return router.push(router.pathname, null, { locale: router.locale === "en" ? "id" : "en" });
            }
        } else {
            window.localStorage.setItem("locale", "id");
            if (locale !== "id") return router.push(router.pathname, null, { locale: "id" });
        }

        setTimeout(() => {
            logEvent(analytic, "page_visit");
        }, 5000);

        const token = window.localStorage.getItem("token");
        if (token) {
            getUser(token);
        } else {
            failed();
        }
    }, []);

    const getUser = (token) => {
        getCurrentUser(token)
            .then((resolve) => {
                const accessToken = window.localStorage.getItem("token");
                success(resolve, { accessToken, isReady: true });
            })
            .catch((reject) => {
                console.log(reject);
                createActivity({ event: "login-failed", meta: { step: "get-user-cache", token, message: reject } });
            });
    };

    if (!tokenRecoil.isReady) return <></>;
    return props.children;
};

const Recoil = ({ Component, pageProps }) => {
    return (
        <RecoilRoot>
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <App>
                    <Head>
                        <title>Kutanya</title>
                        <meta name="description" content={"Universal Reference"} />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <link rel="preconnect" href="https://fonts.googleapis.com" />
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                        <link
                            href={"https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Ubuntu:wght@400;500;600;700&display=swap"}
                            rel="stylesheet"
                        />
                    </Head>

                    <Component {...pageProps} />
                </App>
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    closeButton={false}
                    hideProgressBar={true}
                    limit={5}
                    toastClassName="toast-container"
                    bodyClassName="toast-body"
                />
            </MuiPickersUtilsProvider>
        </RecoilRoot>
    );
};

App.propTypes = {
    token: PropTypes.shape({
        isReady: PropTypes.bool,
    }),
    children: PropTypes.node,
};
Recoil.propTypes = {
    Component: PropTypes.func,
    pageProps: PropTypes.object,
};

export default appWithTranslation(Recoil);
