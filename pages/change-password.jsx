import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "react-toastify";
import styles from "./ForgotPassword.module.scss";

import { authReverse } from "../utils/useAuth";
import { changePassword } from "../utils/api/authApi";

import { BiLeftArrowAlt } from "react-icons/bi";
import LandingContainer from "../components/login/LoginContainer";
import Input from "../components/global/Input";
import { Button } from "../components/global/Button";

const ChangePassword = () => {
    const [isLoading, setLoading] = useState(false);
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

        console.log({
            client_username: "app-ihz-smartsurvey",
            client_secret: "smartsurvey",
            token_reset_password: router.query.reset_token,
            new_password: input.password,
            confirm_new_password: input.repassword,
        });

        setLoading(true);
        changePassword({
            client_username: "app-ihz-smartsurvey",
            client_secret: "smartsurvey",
            token_reset_password: router.query.reset_token,
            new_password: input.password,
            confirm_new_password: input.repassword,
        })
            .then((resolve) => {
                console.log(resolve);
                toast.info("Password has been reset successfully. You can now login.");
                router.push("/login");
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
            <form className={styles.container} onSubmit={handleSubmit(submitHandler)}>
                <div className={styles.header}>
                    <Link href="/login" passHref>
                        <BiLeftArrowAlt />
                    </Link>
                    <h3>{t("change_password_title")}</h3>
                </div>
                <p>{t("change_password_message")}</p>
                <Input
                    label={t("change_password_password")}
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
                    label={t("change_password_repassword")}
                    error={errors.repassword}
                    controller={register("repassword", {
                        required: t_c("error_required"),
                        validate: {
                            not_match: (value) => value === getValues("password") || t("error_password_not_match"),
                        },
                    })}
                    type="password"
                />

                <Button isLoading={isLoading} isSubmit className={styles.button}>
                    {t("change_password_button")}
                </Button>
            </form>
        </LandingContainer>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["login"])),
    },
});

export default authReverse(ChangePassword);
