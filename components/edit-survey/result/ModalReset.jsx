import { useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import ReCAPTCHA from "react-google-recaptcha";

import useModal from "../../../utils/useModal";
import { deleteAnswerBySurvey } from "../../../utils/api/answerApi";
import { timeout } from "../../../utils/functions";

import ModalContainer from "../../modal/ModalContainer";
import { Button, ButtonContainer } from "../../global/Button";

const ModalReset = ({ onSuccess }) => {
    const [isValid, setValid] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const { modal, setModal } = useModal("reset-answer");
    const { t } = useTranslation("edit-survey");
    const router = useRouter();

    const resetHandler = () => {
        setLoading(true);
        deleteAnswerBySurvey(router.query.surveyId)
            .then(async () => {
                await timeout(2000);
                setLoading(false);
                onSuccess();
                setModal(false);
                toast.info(t("success_reset_answer"));
            })
            .catch((reject) => {
                console.log(reject);
                setLoading(false);
                toast.error(reject);
            });
    };

    return (
        <ModalContainer show={modal} isLoading={isLoading}>
            <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY} onChange={(e) => setValid(e)} />
            <ButtonContainer style={{ height: "2.5rem", marginTop: "1rem" }}>
                <Button
                    onClick={() => {
                        setModal(false);
                    }}
                    isTransparent
                    style={{ width: "100%" }}
                >
                    CANCEL
                </Button>
                <Button onClick={resetHandler} isDisabled={!isValid} isLoading={isLoading} style={{ width: "100%" }}>
                    RESET
                </Button>
            </ButtonContainer>
        </ModalContainer>
    );
};

ModalReset.propTypes = {
    onSuccess: PropTypes.func,
};

export default ModalReset;
