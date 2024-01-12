/* eslint-disable no-undef */
import { useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Link from "next/link";
import { toast } from "react-toastify";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useTranslation } from "next-i18next";
import { useForm } from "react-hook-form";
import styles from "./LoginForm.module.scss";

import { FcGoogle } from "react-icons/fc";
import { createActivity } from "../../utils/api/activityApi";
import { shareState } from "../../utils/recoil";
import { useSetRecoilState } from "recoil";
import { getToken, getTokenGoogle, getCurrentUser } from "../../utils/api/authApi";
import useLogin from "../../utils/useLogin";

import { Button } from "../global/Button";
import Loading from "./Loading";
import Input from "../global/Input";

const Login = ({ isLoading, setLoading, isPopup, popupSuccess }) => {
    const [popupLoading, setPopupLoading] = useState(false);
    const setShareData = useSetRecoilState(shareState);
    const router = useRouter();
    const { success } = useLogin();
    const { t } = useTranslation("login");
    const { t: t_c } = useTranslation("common");
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    auth.languageCode = "id";

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm({ shouldFocusError: true });

    const googleHandler = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                setPopupLoading(true);
                const credential = GoogleAuthProvider.credentialFromResult(result);
                console.log(credential);

                const idToken = await result.user.getIdToken();
                if (!idToken) {
                    toast.error("An error occured");
                    return setPopupLoading(false);
                }

                getTokenGoogle({
                    googleToken: idToken,
                    is_active: true,
                    is_verified: true,
                    roleId: process.env.NEXT_PUBLIC_ROLE_USER_BASIC,
                })
                    .then((resolve) => {
                        getUser(resolve);
                    })
                    .catch((reject) => {
                        setPopupLoading(false);
                        toast.error(reject);

                        createActivity({ event: "login-failed", meta: { step: "get-token", email: input.username, message: reject } });
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(errorCode, errorMessage, email, credential);
                if (errorCode !== "auth/popup-closed-by-user") toast.error(errorMessage);
            });
    };

    const submitHandler = (input, e) => {
        e.preventDefault();
        setLoading(true);

        getToken({ ...input, grant_type: "password" })
            .then((resolve) => {
                getUser(resolve);

                if (!resolve.accessToken) {
                    createActivity({ event: "check-token", meta: { email: input.username, message: resolve } });
                }
            })
            .catch((reject) => {
                setLoading(false);

                if (reject === "not-registered") {
                    return router.push({
                        pathname: "/verify-otp",
                        query: {
                            email: input.username,
                        },
                    });
                }

                toast.error(reject);

                createActivity({ event: "login-failed", meta: { step: "get-token", email: input.username, message: reject } });
            });
    };

    const getUser = (token) => {
        getCurrentUser(token.accessToken)
            .then((resolve) => {
                if (isPopup) {
                    success(resolve, { ...token, isReady: true });
                    popupSuccess();
                } else {
                    success(resolve, { ...token, isReady: true }, router.query.survey ? "/survey" + router.query.survey : "/home");
                    setShareData({});
                }
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
                setLoading(false);
                setPopupLoading(false);

                createActivity({ event: "login-failed", meta: { step: "get-user", email: getValues("username"), token, message: reject } });
            });
    };

    return (
        <form className={styles.container + (isPopup ? " " + styles.popup : "")} onSubmit={handleSubmit(submitHandler)}>
            <h3>{t("login_title")}</h3>
            <Input
                label="Email"
                placeholder={t("input_email")}
                error={errors.username}
                controller={register("username", {
                    required: t_c("error_required"),
                    validate: {
                        not_valid: (value) => {
                            const regex = /\S+@\S+\.\S+/;
                            return regex.test(value) || t("error_email_not_valid");
                        },
                    },
                })}
                isLogin
            />
            <Input
                label="Password"
                placeholder={t("input_password")}
                error={errors.password}
                controller={register("password", {
                    required: t_c("error_required"),
                })}
                type="password"
                isLogin
            />

            <div className={styles.forgot}>
                <Link href="/forgot-password">{t("login_forgot_password")}</Link>
            </div>
            <Button isLoading={isLoading} style={{ width: "100%", height: "2.75rem" }} isSubmit>
                {t("login_title")}
            </Button>
            <div className={styles.separator}>
                <div />
                <span>or</span>
                <div />
            </div>
            <Button style={{ width: "100%", height: "2.75rem" }} onClick={googleHandler} isTransparent>
                <FcGoogle />
                <span>{t("login_google")}</span>
            </Button>
            <p>
                {t("login_account") + " "}
                <span className={styles.register}>
                    <Link href="/register">{t("register_here")}</Link>
                </span>
            </p>
            <Loading show={popupLoading} />
        </form>
    );
};

Login.propTypes = {
    isLoading: PropTypes.bool,
    setLoading: PropTypes.func,
    isPopup: PropTypes.bool,
    popupSuccess: PropTypes.func,
};

export default Login;
