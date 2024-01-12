import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useForm } from "react-hook-form";
import styles from "./Register.module.scss";

import { createUser } from "../utils/api/authApi";

import { createActivity } from "../utils/api/activityApi";
import { authReverse } from "../utils/useAuth";
import { useRecoilValue } from "recoil";
import { shareState } from "../utils/recoil";

import LandingContainer from "../components/login/LoginContainer";
import { Button } from "../components/global/Button";
import Input from "../components/global/Input";

const Register = () => {
    const [isLoading, setLoading] = useState(false);
    const shareData = useRecoilValue(shareState);
    const { t } = useTranslation("login");
    const { t: t_c } = useTranslation("common");
    const router = useRouter();

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm();

    const submitHandler = (input, e) => {
        e.preventDefault();

        const newInput = {
            ...input,
            roleId: process.env.NEXT_PUBLIC_ROLE_USER_BASIC,
            level: "user",
            client_username: "app-ihz-smartsurvey",
            client_secret: "smartsurvey",
        };
        delete newInput.repassword;
        if (shareData.verifiedKey) {
            newInput.verifiedKey = shareData.verifiedKey;
        }

        setLoading(true);

        createUser(newInput)
            .then((resolve) => {
                console.log(resolve);
                router.push({ pathname: "/verify-otp", query: { email: input.email, state: "resolve" } });

                const { fullname, email, mobile } = input;
                createActivity({ event: "register", meta: { fullname, email, mobile } });
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);

                const { fullname, email, mobile } = input;
                createActivity({ event: "register-failed", metadata: { reason: reject, fullname, email, mobile } });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <LandingContainer
            description={[t("banner1"), t("banner2"), t("banner3"), t("banner4"), t("banner5")]}
            isLoading={isLoading}
            style={{ paddingTop: ".5rem" }}
        >
            <form className={styles.container} onSubmit={handleSubmit(submitHandler)}>
                <h3>{t("register_title")}</h3>
                <Input
                    label={t("register_name")}
                    error={errors.fullname}
                    controller={register("fullname", {
                        required: t_c("error_required"),
                        validate: {
                            not_valid: (value) => {
                                const regex = /[A-Za-z ]/;
                                return regex.test(value) || t("error_name_not_valid");
                            },
                        },
                    })}
                />
                <Input
                    label={t("register_email")}
                    error={errors.email}
                    controller={register("email", {
                        required: t_c("error_required"),
                        validate: {
                            not_valid: (value) => {
                                const regex = /\S+@\S+\.\S+/;
                                return regex.test(value) || t("error_email_not_valid");
                            },
                        },
                    })}
                />
                <Input
                    label={t("register_mobile")}
                    error={errors.mobile}
                    controller={register("mobile", {
                        required: t_c("error_required"),
                        validate: {
                            length: (value) => (value.length >= 10 && value.length <= 14) || t("error_mobile_length")?.replace("-value-", "10-14"),
                        },
                    })}
                    type="number"
                />
                <Input
                    label={t("register_password")}
                    error={errors.password}
                    controller={register("password", {
                        required: t_c("error_required"),
                        validate: {
                            length: (value) => value.length >= 6 || t("error_password_length")?.replace("-value-", "6"),
                            not_valid: (value) => {
                                const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/;
                                return regex.test(value) || t("error_password_not_valid");
                            },
                        },
                    })}
                    type="password"
                />
                <Input
                    label={t("register_repassword")}
                    error={errors.repassword}
                    controller={register("repassword", {
                        required: t_c("error_required"),
                        validate: {
                            not_match: (value) => value === getValues("password") || t("error_password_not_match"),
                        },
                    })}
                    type="password"
                />
                <Button isLoading={isLoading} style={{ width: "100%", height: "2.75rem", marginTop: "1rem" }} isSubmit>
                    {t_c("register")}
                </Button>
                <p>
                    {t("register_account") + " "}
                    <span>
                        <Link href="/login">{t("login_here")}</Link>
                    </span>
                </p>
            </form>
        </LandingContainer>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "login"])),
    },
});

export default authReverse(Register);
