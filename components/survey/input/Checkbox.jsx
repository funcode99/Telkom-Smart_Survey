import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Option.module.scss";

import RadioButton from "./Radio";

const Checkbox = ({ nowIndex, question, answer, setAnswer, setSkip }) => {
    const [customInput, setCustomInput] = useState("");

    useEffect(() => {
        const checkCustom = question?.option?.some((option) => option.label === answer);
        setCustomInput(!checkCustom ? answer : "");
    }, [nowIndex]);

    useEffect(() => {
        console.log(answer);
    }, [answer]);

    return (
        <RadioButton
            value={answer || []}
            name="radio"
            onChange={(value, optionData) => {
                const newAnswer = answer || [];
                console.log(newAnswer, value);
                const answerIndex = newAnswer.findIndex((answerValue) => answerValue === value);
                if (answerIndex >= 0) {
                    newAnswer.splice(answerIndex, 1);
                    setAnswer(newAnswer, nowIndex);
                } else {
                    setAnswer([...newAnswer, value], nowIndex);
                }

                if (optionData.skipTo) {
                    setSkip(optionData.skipTo - 1);
                } else {
                    setSkip(null);
                }
            }}
            list={question?.option?.map((option, index) => ({
                label: option.label,
                value: option.isCustom && question.option.length === index + 1 ? customInput : option.label,
                skipTo: option.skipTo,
                image: option.optionImage,
                customLabel:
                    option.isCustom && question.option.length === index + 1 ? (
                        <input
                            onClick={(e) => e.stopPropagation()}
                            className={styles.custom_input}
                            value={customInput}
                            onChange={(e) => {
                                setCustomInput(e.target.value);
                                const newAnswer = answer || [];
                                console.log(newAnswer, e.target.value);
                                const answerIndex = newAnswer.findIndex((answerValue) => answerValue === e.target.value);
                                if (answerIndex >= 0) {
                                    newAnswer.splice(answerIndex, 1);
                                    setAnswer(newAnswer, nowIndex);
                                } else {
                                    setAnswer([...newAnswer, e.target.value], nowIndex);
                                }
                            }}
                            placeholder="Lainnya, contoh: Amazon"
                        />
                    ) : null,
            }))}
            containerStyle={{ margin: ".5rem 0 1.5rem", width: "fit-content" }}
            labelStyle={{ fontSize: "0.938rem" }}
            isCheckbox
        />
    );
};

Checkbox.propTypes = {
    nowIndex: PropTypes.number,
    question: PropTypes.shape({
        option: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    answer: PropTypes.number,
    setAnswer: PropTypes.func,
    setSkip: PropTypes.func,
};

export default Checkbox;
