import Image from "next/image";
import PropTypes from "prop-types";
import RadioUncheck from "../../../public/images/global/radio_uncheck.svg";
import RadioChecked from "../../../public/images/global/radio_checked.svg";
import CheckboxUncheck from "../../../public/images/survey/checkbox_uncheck.svg";
import CheckboxChecked from "../../../public/images/survey/checkbox_checked.svg";
import styles from "./Radio.module.scss";

const RadioButton = ({ value, onChange, list, isCheckbox }) => {
    const Checked = isCheckbox ? CheckboxChecked : RadioChecked;
    const Uncheck = isCheckbox ? CheckboxUncheck : RadioUncheck;

    console.log(value);

    return (
        <div className={styles.radio_container + (list.every((radio) => radio.image) ? " " + styles.full_image : "")}>
            {list.map((radio, index) => {
                return (
                    <div className={styles.radio} onClick={() => onChange(radio.value, radio)} key={index}>
                        <div className={styles.icon}>
                            {value && (isCheckbox ? value.includes(radio.value) : value === radio.value) ? <Checked /> : <Uncheck />}
                        </div>
                        <div className={styles.option}>
                            <span>{radio.customLabel || radio.label}</span>
                            {radio.image && (
                                <div className={styles.image}>
                                    <Image src={radio.image} alt="image" layout="fill" objectFit="contain" />
                                </div>
                            )}
                        </div>
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
    isCheckbox: PropTypes.bool,
};

export default RadioButton;
