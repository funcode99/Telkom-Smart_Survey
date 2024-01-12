import { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { authReverse } from "../utils/useAuth";

import LoginContainer from "../components/login/LoginContainer";
import LoginForm from "../components/login/LoginForm";

const Login = () => {
    const [isLoading, setLoading] = useState(false);
    const { t } = useTranslation("login");

    return (
        <LoginContainer description={[t("banner1"), t("banner2"), t("banner3"), t("banner4"), t("banner5")]} isLoading={isLoading} isCenter>
            <LoginForm isLoading={isLoading} setLoading={setLoading} />
        </LoginContainer>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "login"])),
    },
});

export default authReverse(Login);
