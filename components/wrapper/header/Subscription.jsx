import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import styles from "./Subscription.module.scss";

import { useRecoilValue } from "recoil";
import { userProfile } from "../../../utils/recoil";
import PremiumIcon from "../../../public/images/sidebar/premium_icon.svg";
import MerchantIcon from "../../../public/images/sidebar/merchant_white_icon.svg";

const Subscription = ({ isResponsive }) => {
    const profile = useRecoilValue(userProfile);
    const { t } = useTranslation("common");
    const router = useRouter();

    return (
        <>
            {profile.subscription?._id ? (
                <button
                    className={styles.container + (isResponsive ? " " + styles.mobile : "")}
                    onClick={() => {
                        router.push({ pathname: "https://merchant.kutanya.com", query: { state: window.localStorage.getItem("token") } });
                    }}
                >
                    {profile.merchant?.status === "approved" ? (
                        <Image src={profile.merchant.logo} width={20} height={20} alt="banner" />
                    ) : (
                        <MerchantIcon />
                    )}
                    <span>{profile.merchant?.name || t("register_merchant")}</span>
                </button>
            ) : (
                <Link href="/subscription">
                    <a>
                        <button className={styles.container + (isResponsive ? " " + styles.mobile : "")}>
                            <PremiumIcon />
                            <span>{t("upgrade_premium")}</span>
                        </button>
                    </a>
                </Link>
            )}
        </>
    );
};

Subscription.propTypes = {
    isResponsive: PropTypes.bool,
};

export default Subscription;
