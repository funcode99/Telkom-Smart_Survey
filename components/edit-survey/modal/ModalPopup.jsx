import PropTypes from "prop-types";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import styles from "./ModalPopup.module.scss";

import WarningIcon from "../../../public/images/global/warning.png";
import useModal from "../../../utils/useModal";

import ModalContainer from "../../../components/modal/ModalContainer";
import { Button, ButtonContainer } from "../../../components/global/Button";

const ModalSubmit = ({ title, message, onSubmit, buttonLabel, modalIdentifier, isLoading }) => {
    const { modal, setModal } = useModal(modalIdentifier);
    const { t: t_c } = useTranslation("common");

    return (
        <ModalContainer show={modal} customContainer={{ padding: "1.5rem 2.375rem" }} customOverlay={{ alignItems: "center" }} isLoading={isLoading}>
            <div className={styles.body}>
                <Image src={WarningIcon.src} alt="warning" width={120} height={122} />
                <h2>{title}</h2>
                <p>{message}</p>
                <ButtonContainer>
                    <Button onClick={() => setModal(false)} style={{ flex: 1, height: "3rem" }} isTransparent>
                        {t_c("cancel")}
                    </Button>
                    <Button style={{ flex: 1, height: "3rem" }} onClick={onSubmit} isLoading={isLoading}>
                        {buttonLabel}
                    </Button>
                </ButtonContainer>
            </div>
        </ModalContainer>
    );
};

ModalSubmit.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    buttonLabel: PropTypes.string,
    modalIdentifier: PropTypes.string,
    isLoading: PropTypes.bool,
    onSubmit: PropTypes.func,
};

export default ModalSubmit;
