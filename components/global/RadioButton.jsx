import PropTypes from "prop-types";
import RadioUncheck from "../../public/images/global/radio_uncheck.svg";
import RadioChecked from "../../public/images/global/radio_checked.svg";
import CheckboxUncheck from "../../public/images/survey/checkbox_uncheck.svg";
import CheckboxChecked from "../../public/images/survey/checkbox_checked.svg";
import styles from "./RadioButton.module.scss";

const RadioButton = ({ value, onChange, list, className, containerStyle = {}, labelStyle = {}, isCheckbox }) => {
    const Checked = isCheckbox ? CheckboxChecked : RadioChecked;
    const Uncheck = isCheckbox ? CheckboxUncheck : RadioUncheck;

    return (
        <div className={className ? className : styles.radio_container} style={containerStyle}>
            {list.map((radio, index) => {
                return (
                    <div className={styles.radio} onClick={() => onChange(radio.value, radio)} key={index}>
                        <div>{value && (isCheckbox ? value.includes(radio.value) : value === radio.value) ? <Checked /> : <Uncheck />}</div>
                        <span style={labelStyle}>{radio.customLabel || radio.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

RadioButton.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    list: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string,
        })
    ),
    className: PropTypes.string,
    containerStyle: PropTypes.object,
    labelStyle: PropTypes.object,
    isCheckbox: PropTypes.bool,
};

export default RadioButton;
