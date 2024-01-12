import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import OtpField from "react-otp-field";
import styles from "./VerifyOtp.module.scss";

import { authReverse } from "../utils/useAuth";
import { verifyEmail, sendOtp } from "../utils/api/authApi";
import { createActivity } from "../utils/api/activityApi";

import LandingContainer from "../components/login/LoginContainer";
import { Button } from "../components/global/Button";
import RegisterSuccess from "../components/login/RegisterSuccess";

const secondsToMinutes = (seconds) => Math.floor(seconds / 60) + ":" + ("0" + Math.floor(seconds % 60)).slice(-2);

const Otp = () => {
    const [otpState, setOtpState] = useState("sending"); // sending, ready_to_send, resending, countdown
    const [countdown, setCountdown] = useState(null);
    const [input, setInput] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    const { t } = useTranslation("login");
    const { t: t_c } = useTranslation("common");
    const router = useRouter();
    const { email } = router.query;

    useEffect(() => {
        if (email) {
            if (router.query.state === "resolve") {
                setOtpState("countdown");
            } else {
                sendingOtp(true);
            }
        } else {
            router.replace("/login");
        }
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (typeof countdown === "number") {
            setOtpState("ready_to_send");
        }
    }, [countdown]);

    useEffect(() => {
        if (otpState === "countdown") setCountdown(180);
    }, [otpState]);

    const submitHandler = (e) => {
        e.preventDefault();
        setLoading(true);

        verifyEmail({
            client_username: "app-ihz-smartsurvey",
            client_secret: "smartsurvey",
            email: email,
            otp_code: input,
            is_active: true,
        })
            .then(() => {
                toast.info(t("success_otp"));
                setSuccess(true);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const sendingOtp = (initial) => {
        setOtpState(initial ? "sending" : "resending");
        const args = {
            client_username: "app-ihz-smartsurvey",
            client_secret: "smartsurvey",
            otp_field_key: "email",
            otp_field_value: email,
            otp_channel: "email",
            otp_digit: 6,
        };
        sendOtp(args)
            .then(() => {
                setOtpState("countdown");
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
                setOtpState("ready_to_send");

                createActivity({ event: "otp-failed", meta: { email, message: reject } });
            });
    };

    return (
        <LandingContainer description={[t("banner1"), t("banner2"), t("banner3"), t("banner4"), t("banner5")]} isLoading={isLoading} isCenter>
            {isSuccess ? (
                <RegisterSuccess t={t} />
            ) : (
                <form className={styles.container} onSubmit={submitHandler}>
                    <h1>{t("otp_title")}</h1>
                    <p>
                        {t("otp_message")} {email}
                    </p>
                    <OtpField classNames={styles.input_container} value={input} onChange={setInput} numInputs={6} autoFocus isTypeNumber />

                    {otpState === "sending" ? (
                        <span>{t("otp_sending")}</span>
                    ) : otpState === "resending" ? (
                        <span>{t("otp_resending")}</span>
                    ) : otpState === "ready_to_send" ? (
                        <span onClick={() => sendingOtp(false)} style={{ color: "#7b6ee3", cursor: "pointer" }}>
                            {t("otp_ready_to_send")}
                        </span>
                    ) : (
                        <span>
                            {t("otp_countdown")} {secondsToMinutes(countdown)}
                        </span>
                    )}

                    <Button
                        style={{ width: "100%", height: "2.75rem" }}
                        isDisabled={["sending", "resending"].includes(otpState) || input.length < 6}
                        isLoading={isLoading}
                        onClick={submitHandler}
                    >
                        {t_c("send")}
                    </Button>
                </form>
            )}
        </LandingContainer>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "login"])),
    },
});

export default authReverse(Otp);
