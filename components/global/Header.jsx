import PropTypes from "prop-types";
import styles from "./Header.module.scss";

import { MdClose } from "react-icons/md";

import Tooltip from "./Tooltip";
import { ButtonContainer, Button } from "./Button";

export const PageHeader = ({ title, tooltip, buttonList }) => {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>{title}</h1>
                {tooltip && <Tooltip message={tooltip} />}
            </div>
            {buttonList && (
                <ButtonContainer style={{ width: "fit-content" }}>
                    {buttonList.map((button, index) => {
                        return (
                            <Button
                                key={index}
                                onClick={button.onClick}
                                style={{ fontWeight: "bold", flex: "initial", height: "2.75rem", padding: "0 1rem", ...button.style }}
                            >
                                {button.label}
                            </Button>
                        );
                    })}
                </ButtonContainer>
            )}
        </div>
    );
};

PageHeader.propTypes = {
    title: PropTypes.string,
    tooltip: PropTypes.string,
    buttonList: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            onClick: PropTypes.func,
            style: PropTypes.object,
        })
    ),
};

export const ModalHeader = ({ title, style, titleStyle, tooltip, close }) => {
    return (
        <div className={styles.container + " " + styles.modal} style={style}>
            <div className={styles.title}>
                <h1 style={titleStyle}>{title}</h1>
                {tooltip && <Tooltip message={tooltip} />}
            </div>
            {close && <MdClose onClick={() => close.onClick()} style={close.style} />}
        </div>
    );
};

ModalHeader.propTypes = {
    title: PropTypes.string,
    titleStyle: PropTypes.object,
    tooltip: PropTypes.string,
    close: PropTypes.shape({
        onClick: PropTypes.func,
        style: PropTypes.object,
    }),
    style: PropTypes.object,
};
