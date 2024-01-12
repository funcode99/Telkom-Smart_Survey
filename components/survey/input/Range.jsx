import PropTypes from "prop-types";
import styles from "./Range.module.scss";

import RadioChecked from "../../../public/images/global/radio_checked.svg";
import RadioUncheck from "../../../public/images/global/radio_uncheck.svg";

const Range = ({ question, answer, setAnswer }) => {
    return (
        <div className={styles.container}>
            <label>{question.minLabel}</label>
            <div className={styles.button_container}>
                {Array.from({ length: question.max - question.min + 1 }, (_, index) => {
                    console.log(answer, question.min);
                    return (
                        <div className={styles.button} onClick={() => setAnswer((question.min + index).toString())}>
                            {answer === question.min + index ? <RadioChecked /> : <RadioUncheck />}
                            <span>{question.min + index}</span>
                        </div>
                    );
                })}
            </div>
            <label>{question.maxLabel}</label>
        </div>
    );
};

Range.propTypes = {
    question: PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number,
        minLabel: PropTypes.string,
        maxLabel: PropTypes.string,
    }),
    answer: PropTypes.number,
    setAnswer: PropTypes.func,
};

export default Range;
