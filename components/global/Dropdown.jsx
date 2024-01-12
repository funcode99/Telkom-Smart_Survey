import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./Dropdown.module.scss";

import useOverlay from "../../utils/useOverlay";
import Arrow from "../../public/images/arrow_down.svg";
import { FaCheck } from "react-icons/fa";

import Spinner from "./Spinner";

const Dropdown = ({
    id,
    options,
    error,
    value,
    onSelect,
    placeholder = "Select option",
    isLoading,
    isDisabled,
    className,
    style,
    placeholderStyle,
    isFloating,
}) => {
    const [isOpen, setOpen] = useState(false);
    useOverlay(isOpen, setOpen, id);

    return (
        <div className={(isOpen ? styles.active + " " : "") + styles.container + (className ? " " + className : "")} id={id} style={style}>
            <div
                className={styles.placeholder}
                onClick={() => {
                    if (!isDisabled) setOpen(!isOpen);
                    console.log("open", !isLoading && !isDisabled);
                }}
                style={{ ...placeholderStyle, borderColor: error && "red" }}
            >
                <button type="button">{value ? options.find((option) => option.value === value)?.label : placeholder}</button>
                <Arrow />
            </div>
            <div className={styles.panel} style={{ display: !isOpen && "none", position: isFloating && "absolute", top: isFloating && "100%" }}>
                {isLoading ? (
                    <Spinner size={60} style={{ padding: "1rem 0" }} />
                ) : (
                    options.map((option) => {
                        return (
                            <div
                                className={styles.option}
                                onClick={() => {
                                    onSelect(option.value, option.data);
                                    setOpen(false);
                                }}
                                key={option.value}
                            >
                                <button type="button">{option.label}</button>
                                {value === option.value && <FaCheck />}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

Dropdown.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string,
        })
    ),
    error: PropTypes.object,
    id: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSelect: PropTypes.func,
    onBlur: PropTypes.func,
    placeholder: PropTypes.string,
    isLoading: PropTypes.bool,
    isDisabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    isFloating: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.string,
    placeholderStyle: PropTypes.object,
};

export default Dropdown;
