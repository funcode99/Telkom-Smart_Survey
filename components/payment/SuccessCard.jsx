import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import PropTypes from "prop-types";
import styles from "./Card.module.scss";

import SuccessIcon from "../../public/images/topup/success_icon.svg";

const Success = ({ redirect }) => {
    const router = useRouter();
    const { t } = useTranslation("payment");

    useEffect(() => {
        setTimeout(() => {
            router.push(redirect || "/");
        }, 3000);
    }, []);

    return (
        <div className={styles.container + " " + styles.success}>
            <SuccessIcon />
            <span>{t("payment_success")}</span>
        </div>
    );
};

Success.propTypes = {
    redirect: PropTypes.string,
};

export default Success;
