import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import styles from "./ModalRefund.module.scss";

import useModal from "../../../utils/useModal";
import { refundPoint, refundVoucher } from "../../../utils/api/voucherApi";
import { convertRupiah } from "../../../utils/functions";

import ModalContainer from "../../modal/ModalContainer";
import { ButtonContainer, Button } from "../../global/Button";
import Popup from "../../global/Popup";

const ModalRefund = ({ setSurvey }) => {
    const [reward, setReward] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [isPopup, setPopup] = useState(false);
    const { modal, setModal, data } = useModal("refund-reward");
    const { t } = useTranslation("edit-survey");
    const { t: t_c } = useTranslation("common");
    const router = useRouter();

    useEffect(() => {
        console.log(data);
        if (data._id) setReward(data);
    }, [data]);

    const submitHandler = () => {
        const refund = reward.isVoucher ? refundVoucher : refundPoint;

        setLoading(true);
        refund({ surveyId: router.query.surveyId })
            .then((resolve) => {
                console.log(resolve);
                setSurvey({ transferPoint: {}, voucherReward: {} });
                setPopup(true);
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
                show={modal}
                setPopup={setPopup}
                icon="success"
                title={t(reward.isVoucher ? "success_refund_voucher" : "success_refund_point")}
                submitButton={{
                    label: t_c("ok"),
                    onClick: () => setModal(false),
                }}
            />
        );
    }

    return (
        <ModalContainer show={modal} isLoading={isLoading} isCenter onClose={() => setReward({})}>
            <h5 className={styles.title}>{t(reward.isVoucher ? "refund_voucher_title" : "refund_point_title")}</h5>
            <div className={styles.body}>
                {t(reward.isVoucher ? "refund_voucher_message" : "refund_point_message")} {reward.qty}
                {!reward.isVoucher && ` (${convertRupiah(reward.qty * reward.unit * 100)})`}
            </div>
            <ButtonContainer>
                <Button style={{ flex: 1 }} isTransparent onClick={() => setModal(false)}>
                    {t_c("cancel")}
                </Button>
                <Button style={{ flex: 1 }} onClick={submitHandler} isLoading={isLoading}>
                    {t_c("next")}
                </Button>
            </ButtonContainer>
        </ModalContainer>
    );
};

ModalRefund.propTypes = {
    setSurvey: PropTypes.func,
};

export default ModalRefund;
