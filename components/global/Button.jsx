import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.scss";

import Spinner from "./Spinner";

export const ButtonContainer = ({ children, style, className }) => {
    return (
        <div className={className ? className : styles.container} style={style}>
            {children}
        </div>
    );
};

ButtonContainer.propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    className: PropTypes.string,
};

export const Button = ({ children, style, className, onClick, isSubmit, isLoading, isDisabled, isTransparent }) => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const buttonRef = useRef();

    useEffect(() => {
        setSize({ width: buttonRef.current?.offsetWidth, height: buttonRef.current?.offsetHeight });
    }, []);

    return (
        <button
            type={isSubmit ? "submit" : "button"}
            ref={buttonRef}
            className={
                styles.button +
                (className ? " " + className : "") +
                (isTransparent ? " " + styles.transparent : "") +
                (isDisabled ? " " + styles.disabled : "") +
                (isLoading ? " " + styles.loading : "")
            }
            style={{ height: isLoading ? size.height : null, width: isLoading ? size.width : null, ...style }}
            disabled={isDisabled || isLoading}
            onClick={onClick ? onClick : null}
        >
            {isLoading ? <Spinner color={isTransparent ? "#7b6ee3" : "white"} size={(size.height / 10) * 6} /> : children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node,
    type: PropTypes.oneOf(["button", "submit"]),
    style: PropTypes.object,
    onClick: PropTypes.func,
    className: PropTypes.string,
    isSubmit: PropTypes.bool,
    isTransparent: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isLoading: PropTypes.bool,
};
