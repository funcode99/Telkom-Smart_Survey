import PropTypes from "prop-types";
import { isMobile } from "detect-mobile-device";
import styles from "./Button.module.scss";

import { ButtonContainer, Button } from "../Button";

const ButtonList = ({ buttonList, buttonStyle }) => {
    return (
        <ButtonContainer
            style={{ alignItems: "center", height: "fit-content", width: "fit-content", flexWrap: "wrap", flex: isMobile() && 1, ...buttonStyle }}
        >
            {buttonList?.map((button) => {
                return (
                    !button.isHidden && (
                        <Button
                            className={styles.button + (isMobile() ? " " + styles.mobile : "")}
                            isTransparent={button.isTransparent}
                            isDisabled={button.isDisabled}
                            isLoading={button.isLoading}
                            onClick={() => button.onClick(button)}
                            key={button.label}
                            style={{
                                height: "2.5rem",
                                minWidth: button.icon ? "fit-content" : "8.4rem",
                                padding: "0 1rem",
                                flex: isMobile() && !button.icon && 1,
                                ...button.style,
                            }}
                        >
                            {button.icon || button.label}
                        </Button>
                    )
                );
            })}
        </ButtonContainer>
    );
};

ButtonList.propTypes = {
    buttonList: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            onClick: PropTypes.func,
            isTransparent: PropTypes.bool,
            isHidden: PropTypes.bool,
        })
    ),
    buttonStyle: PropTypes.object,
};

export default ButtonList;
