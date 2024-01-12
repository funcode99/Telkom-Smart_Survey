import { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "react-toastify";
import styles from "./ForgotPassword.module.scss";

import { authReverse } from "../utils/useAuth";
import { forgotPassword } from "../utils/api/authApi";

import { BiLeftArrowAlt } from "react-icons/bi";
import LandingContainer from "../components/login/LoginContainer";
import Input from "../components/global/Input";
import OtpSuccess from "../components/login/OtpSuccess";
import { Button } from "../components/global/Button";

const ForgotPassword = () => {
    const [isLoading, setLoading] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    const { t } = useTranslation("login");
    const { t: t_c } = useTranslation("common");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const submitHandler = (input, e) => {
        e.preventDefault();

        setLoading(true);
        forgotPassword({
            client_username: "app-ihz-smartsurvey",
            client_secret: "smartsurvey",
            forgot_field_key: "email",
            forgot_field_value: input.email,
            email_link: "https://kutanya.com/change-password?reset_token={reset_password_code}",
            email_expired_in: 60,
        })
            .then(() => {
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

    return (
        <LandingContainer description={[t("banner1"), t("banner2"), t("banner3"), t("banner4"), t("banner5")]} isLoading={isLoading} isCenter>
            {isSuccess ? (
                <OtpSuccess t={t} />
            ) : (
                <form className={styles.container} onSubmit={handleSubmit(submitHandler)}>
                    <div className={styles.header}>
                        <Link href="/login" passHref>
                            <BiLeftArrowAlt />
                        </Link>
                        <h3>{t("forgot_title")}</h3>
                    </div>
                    <p>{t("forgot_message")}</p>
                    <Input
                        label="Email"
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
                    <Button isLoading={isLoading} isSubmit className={styles.button}>
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

export default authReverse(ForgotPassword);
