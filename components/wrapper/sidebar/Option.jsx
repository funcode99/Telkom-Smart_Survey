import Image from "next/image";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./Option.module.scss";

import useModal from "../../../utils/useModal";
import { userProfile } from "../../../utils/recoil";
import { useRecoilValue } from "recoil";

import HomeIcon from "../../../public/images/sidebar/home.png";
import SurveyIcon from "../../../public/images/sidebar/survey.png";
import StoreIcon from "../../../public/images/sidebar/store.png";
import GroupIcon from "../../../public/images/sidebar/group.png";
import ExchangeIcon from "../../../public/images/sidebar/exchange.png";
import FaqIcon from "../../../public/images/sidebar/faq.png";
import FeedbackIcon from "../../../public/images/sidebar/feedback.svg";
import LogoutIcon from "../../../public/images/sidebar/logout.png";

import HomeIconFill from "../../../public/images/sidebar/home_fill.png";
import SurveyIconFill from "../../../public/images/sidebar/survey_fill.png";
import StoreIconFill from "../../../public/images/sidebar/store_fill.png";
import GroupIconFill from "../../../public/images/sidebar/group_fill.png";
import ExchangeIconFill from "../../../public/images/sidebar/exchange_fill.png";
import FaqIconFill from "../../../public/images/sidebar/faq_fill.png";

const OptionList = ({ t, isResponsive }) => {
    const { setModal: setModalFeedback } = useModal("send-feedback");
    const profile = useRecoilValue(userProfile);
    const router = useRouter();

    const logoutHandler = () => {
        if (window !== "undefined") {
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("refreshToken");
            window.location.replace("/login");
        }
    };

    const Option = ({ label, path, includes = [], icon, iconActive }) => {
        return (
            <Link href={path}>
                <a>
                    <div className={styles.option + ([...includes, path].includes(router.pathname) ? " " + styles.active : "")}>
                        <Image
                            src={[...includes, path].includes(router.pathname) ? iconActive.src : icon.src}
                            alt={t(label)}
                            width={24}
                            height={24}
                        />
                        <label>{t(label)}</label>
                    </div>
                </a>
            </Link>
        );
    };

    Option.propTypes = {
        label: PropTypes.string,
        path: PropTypes.string,
        includes: PropTypes.arrayOf(PropTypes.string),
        icon: PropTypes.node,
        iconActive: PropTypes.node,
    };

    return (
        <div className={styles.container + (isResponsive ? " " + styles.mobile : "")}>
            <Option label="home" path="/home" icon={HomeIcon} iconActive={HomeIconFill} />
            <Option label="survey" path="/survey-list" includes={["/edit-survey/[surveyId]"]} icon={SurveyIcon} iconActive={SurveyIconFill} />
            {profile.level === "user" ? (
                <>
                    <Option label="store" path="/store" icon={StoreIcon} iconActive={StoreIconFill} />
                    <Option
                        label="exchange_point"
                        path="/exchange/redeem-points"
                        includes={["/exchange"]}
                        icon={ExchangeIcon}
                        iconActive={ExchangeIconFill}
                    />
                </>
            ) : (
                <Option label="user" path="/user" icon={GroupIcon} iconActive={GroupIconFill} />
            )}
            {profile.level === "super" && (
                <>
                    <Option label="Statistic" path="/statistic" icon={GroupIcon} iconActive={GroupIconFill} />
                    <Option label="Feedback List" path="/feedback" icon={GroupIcon} iconActive={GroupIconFill} />
                    <Option label="Merchant List" path="/admin/merchant-list" icon={GroupIcon} iconActive={GroupIconFill} />
                    <Option label="Voucher List" path="/admin/voucher-list" icon={GroupIcon} iconActive={GroupIconFill} />
                    <Option label="Withdraw List" path="/admin/withdraw-list" icon={GroupIcon} iconActive={GroupIconFill} />
                </>
            )}

            {profile.level === "user" && (
                <>
                    <Option label="group" path="/group" icon={GroupIcon} iconActive={GroupIconFill} />
                    <Option label="faq" path="/faq" icon={FaqIcon} iconActive={FaqIconFill} />
                </>
            )}
            <div className={styles.bottom_option}>
                {profile.level === "user" && (
                    <div className={styles.option + " " + styles.feedback} onClick={() => setModalFeedback(true)}>
                        <FeedbackIcon />
                        <label>{t("feedback")}</label>
                    </div>
                )}
                <div className={styles.option + " " + styles.logout} onClick={logoutHandler}>
                    <Image src={LogoutIcon.src} width={24} height={24} alt="logout" />
                    <label>{t("logout")}</label>
                </div>
            </div>
        </div>
    );
};

OptionList.propTypes = {
    t: PropTypes.func,
    isResponsive: PropTypes.bool,
};

export default OptionList;
