import PropTypes from "prop-types";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import styles from "./Popup.module.scss";

import WarningIcon from "../../public/images/global/warning.png";
import SuccessIcon from "../../public/images/global/success.png";
import OkIcon from "../../public/images/global/ok.png";
import { ButtonContainer, Button } from "./Button";
import ModalContainer from "../modal/ModalContainer";

const getIcon = (icon) => {
    switch (icon) {
        case "warning":
            return <Image src={WarningIcon.src} width={120} height={122} alt="warning" />;
        case "ok":
            return <Image src={OkIcon.src} width={120} height={120} alt="ok" />;
        case "success":
            return <Image src={SuccessIcon.src} width={120} height={120} alt="ok" />;
        default:
            return icon;
    }
};

const Popup = ({
    show,
    icon = "warning",
    modalProps,
    title,
    titleStyle,
    message,
    messageStyle,
    button,
    setPopup = () => null,
    onClose = () => null,
    cancelButton,
    submitButton,
}) => {
    const { t } = useTranslation("common");

    return (
        <ModalContainer
            show={show}
            onClose={() => {
                setPopup(false);
                onClose();
            }}
            customContainer={{
                width: "23.25rem",
            }}
            {...modalProps}
        >
            <div className={styles.container}>
                {getIcon(icon)}
                <h2 style={titleStyle}>{title}</h2>
                <p style={messageStyle}>{message}</p>
                {button || (
                    <ButtonContainer>
                        {cancelButton && (
                            <Button
                                onClick={() => cancelButton.onClick()}
                                style={{ flex: 1, height: "3rem" }}
                                isTransparent
                                isDisabled={cancelButton.isDisabled}
                                isLoading={cancelButton.isLoading}
                            >
                                {cancelButton.label || t("cancel")}
                            </Button>
                        )}
                        <Button
                            style={{ flex: 1, height: "3rem" }}
                            onClick={() => submitButton.onClick()}
                            isDisabled={submitButton.isDisabled}
                            isLoading={submitButton.isLoading}
                            isTransparent={submitButton.isTransparent}
                        >
                            {submitButton.label || t("next")}
                        </Button>
                    </ButtonContainer>
                )}
            </div>
        </ModalContainer>
    );
};

Popup.propTypes = {
    show: PropTypes.bool,
    icon: PropTypes.oneOfType([PropTypes.node, PropTypes.oneOf(["warning", "ok", "success"])]),
    modalProps: PropTypes.object,
    title: PropTypes.string,
    titleStyle: PropTypes.object,
    message: PropTypes.string,
    messageStyle: PropTypes.object,
    button: PropTypes.node,
    setPopup: PropTypes.func,
    onClose: PropTypes.func,
    cancelButton: PropTypes.shape({
        label: PropTypes.string,
        onClick: PropTypes.func,
        isDisabled: PropTypes.bool,
        isLoading: PropTypes.bool,
        isTransparent: PropTypes.bool,
    }),
    submitButton: PropTypes.shape({
        label: PropTypes.string,
        onClick: PropTypes.func,
        isDisabled: PropTypes.bool,
        isLoading: PropTypes.bool,
        isTransparent: PropTypes.bool,
    }),
};

export default Popup;
