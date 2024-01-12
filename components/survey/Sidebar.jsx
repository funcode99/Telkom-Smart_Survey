import { useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import styles from "./Sidebar.module.scss";

import useModal from "../../utils/useModal";
import { timeout } from "../../utils/functions";
import { cloneSurvey } from "../../utils/api/surveyApi";

import { Button } from "../global/Button";
import Modal from "./ModalPurchase";
import { useEffect } from "react";

const background = {
    sell: {
        color: "#FF7E00",
        background: "#FFF7EC",
    },
    share: {
        color: "#A980F8",
        background: "#F1F0FF",
    },
    purchased: {
        color: "#115B79",
        background: "#ECFFFC",
    },
};

const Sidebar = ({ survey, isLogin }) => {
    const [isLoading, setLoading] = useState(false);
    const [isPurchased, setPurchased] = useState(false);
    const { setModal } = useModal("buy-template");
    const { setModal: setModalLogin } = useModal("popup-login");
    const { t } = useTranslation("store");
    const { t: t_c } = useTranslation("common");
    const router = useRouter();
    console.log(survey);

    useEffect(() => {
        setPurchased(survey.isPurchased);
    }, [survey.isPurchased]);

    const cloneHandler = () => {
        setLoading(true);
        cloneSurvey({ surveyId: survey._id })
            .then(async (resolve) => {
                await timeout(2000);
                router.push("/edit-survey/" + resolve._id);
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
        <div className={styles.container}>
            <div className={styles.body}>
                <h3 className={styles.title}>{survey.title}</h3>
                <div className={styles.label}>
                    <label style={background[isPurchased ? "purchased" : survey.isSelling]}>
                        {isPurchased ? t_c("purchased") : survey.isSelling === "sell" ? t_c("template_paid") : t_c("template_free")}
                    </label>
                </div>
                <div className={styles.profile}>
                    <span>{t_c("template")}</span>
                    <label>{survey.createdBy?.name}</label>
                </div>
                <p className={styles.description}>{survey.description}</p>
                <div className={styles.info}>
                    <span>{t_c("question")}</span>
                    <label>{survey.questions?.length || 0}</label>
                </div>
                <div className={styles.info}>
                    <span>{t_c("used")}</span>
                    <label>{survey.totalUsed || 0}</label>
                </div>
            </div>
            <div className={styles.button_container}>
                {isPurchased ? (
                    <div className={styles.button}>
                        <Button style={{ width: "100%", height: "3rem" }} onClick={() => cloneHandler()} isLoading={isLoading}>
                            {t_c("template_use")}
                        </Button>
                    </div>
                ) : (
                    <div className={styles.button}>
                        <div className={styles.button_price}>
                            <span>Price</span>
                            <label>
                                <b>{survey.isSelling === "share" ? "Free" : survey.price}</b>
                                {survey.isSelling === "sell" ? t_c("point") : ""}
                            </label>
                        </div>
                        <Button
                            style={{ width: "100%", height: "unset" }}
                            onClick={() => {
                                if (!isLogin) {
                                    setModalLogin(true);
                                } else {
                                    setModal(true);
                                }
                            }}
                        >
                            {t("template_buy")}
                        </Button>
                    </div>
                )}
            </div>
            <Modal survey={survey} setPurchased={setPurchased} />
        </div>
    );
};

Sidebar.propTypes = {
    survey: PropTypes.shape({
        _id: PropTypes.string,
        questions: PropTypes.array,
        title: PropTypes.string,
        description: PropTypes.string,
        isSelling: PropTypes.oneOf(["none", "share", "sell"]),
        isPurchased: PropTypes.bool,
        price: PropTypes.number,
        totalUsed: PropTypes.number,
        createdBy: PropTypes.shape({
            name: PropTypes.string,
        }),
    }),
    isLogin: PropTypes.bool,
};

export default Sidebar;
