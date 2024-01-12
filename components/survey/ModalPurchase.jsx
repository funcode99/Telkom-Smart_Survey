/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import useWallet from "../../utils/useWallet";
import styles from "./ModalPurchase.module.scss";

import useModal from "../../utils/useModal";
import { buyTemplate } from "../../utils/api/surveyApi";

import ModalContainer from "../modal/ModalContainer";
import { Button } from "../global/Button";
import { ModalHeader as Header } from "../global/Header";
import Popup from "../global/Popup";

const Modal = ({ survey, setPurchased }) => {
    const [isLoading, setLoading] = useState(false);
    const [isPopup, setPopup] = useState(false);
    const { modal, setModal } = useModal("buy-template");
    const { t } = useTranslation("store");
    const { t: t_c } = useTranslation("common");
    const { wallet } = useWallet();
    const router = useRouter();

    const submitHandler = () => {
        setLoading(true);
        buyTemplate({
            surveyId: survey._id,
            price: survey.price || 0,
        })
            .then(() => {
                setPopup(true);
                setPurchased(true);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (isPopup) {
        return (
            <Popup
                icon="success"
                show={modal}
                setPopup={setPopup}
                modalProps={{ isLoading }}
                title={t("success_buy_template").replace("-value-", survey.type.toLowerCase())}
                cancelButton={{
                    label: t_c("ok"),
                    onClick: () => setModal(false),
                }}
                submitButton={{
                    label: t("success_buy_button"),
                    onClick: () => router.push("/survey-list?menu=my_library"),
                }}
            />
        );
    }

    return (
        <ModalContainer
            show={modal}
            isLoading={isLoading}
            isCenter
            customContainer={{ width: "20rem", marginTop: "-10rem", padding: "24px 30px 20px" }}
        >
            <Header
                title={t("template_buy_small") + ` "${survey.title}"`}
                style={{ alignItems: "flex-start", gap: "2rem" }}
                close={{
                    onClick: () => setModal(false),
                }}
            />

            <div className={styles.container}>
                <div>
                    <span>{t("template_your_point")}</span>
                    <label>
                        {wallet} {t_c("point")}
                    </label>
                </div>
                <div>
                    <span>{t("template_price")}</span>
                    <label>
                        {survey.price} {t_c("point")}
                    </label>
                </div>
            </div>
            <Button onClick={submitHandler} style={{ width: "100%", height: "3rem" }} isLoading={isLoading}>
                {t_c("buy")}
            </Button>
        </ModalContainer>
    );
};

Modal.propTypes = {
    survey: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.oneOf("survey", "quiz"),
        price: PropTypes.price,
    }),
};

export default Modal;
