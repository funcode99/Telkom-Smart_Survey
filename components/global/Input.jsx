import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./Input.module.scss";

import HideIcon from "../../public/images/global/password_hide.svg";
import ShowIcon from "../../public/images/global/password_show.svg";

import Tooltip from "./Tooltip";

const Input = ({
    value,
    onChange,
    controller,
    error,
    message,
    label,
    type,
    placeholder,
    tooltip,
    isDisabled,
    isRequired,
    isLogin,
    children,
    className,
    inputClassName,
    style,
    labelStyle,
}) => {
    const [isHide, setHide] = useState(true);

    return (
        <div className={(error ? styles.error + " " : "") + styles.input_container + (className ? " " + className : "")} style={style}>
            {label && (
                <div className={styles.label}>
                    <label style={labelStyle}>{label}</label>
                    {tooltip && <Tooltip message={tooltip} id={label} />}
                </div>
            )}
            {children ? (
                <div className={styles.input}>{children}</div>
            ) : (
                <div className={styles.input}>
                    <input
                        value={value}
                        onChange={(e) => {
                            if (onChange) onChange(e);
                        }}
                        {...controller}
                        className={inputClassName}
                        type={type === "password" ? (isHide ? "password" : "text") : type || "text"}
                        disabled={isDisabled}
                        placeholder={placeholder}
                        required={isRequired}
                        autoComplete={!isLogin && "new-password"}
                        style={{ paddingRight: type === "password" && "3.5rem" }}
                    />
                    {type === "password" && (
                        <button type="button" onClick={() => setHide(!isHide)} className={styles.hide_icon} tabIndex={-1}>
                            {isHide ? <HideIcon /> : <ShowIcon />}
                        </button>
                    )}
                </div>
            )}
            {(error && <div className={styles.error_message}>{error.message}</div>) || message}
        </div>
    );
};

Input.propTypes = {
    controller: PropTypes.object,
    error: PropTypes.object,
    message: PropTypes.node,
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    tooltip: PropTypes.string,
    onChange: PropTypes.func,
    isLoading: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
    isLogin: PropTypes.bool,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    inputClassName: PropTypes.string,
    style: PropTypes.object,
    labelStyle: PropTypes.object,
    children: PropTypes.node,
};

export default Input;
