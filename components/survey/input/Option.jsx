import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Option.module.scss";

// import Card from "./Card";
import RadioButton from "./Radio";

const Option = ({ nowIndex, question, answer, setAnswer, setSkip }) => {
    const [customInput, setCustomInput] = useState("");

    useEffect(() => {
        console.log(question);
        const checkCustom = question?.option?.some((option) => option.label === answer);
        setCustomInput(!checkCustom ? answer : "");
    }, [nowIndex]);

    // return (
    //     <div className={styles.container}>
    //         {question?.option?.map((option, index) => {
    //             const value = option.isCustom && question.option.length === index + 1 ? customInput : option.label;

    //             return (
    //                 <Card
    //                     label={option.label}
    //                     image={option.optionImage}
    //                     key={index}
    //                     isActive={answer === value}
    //                     onClick={() => {
    //                         setAnswer(value);
    //                         if (option.skipTo) {
    //                             setSkip(option.skipTo - 1);
    //                         } else {
    //                             setSkip(null);
    //                         }
    //                     }}
    //                 />
    //             );
    //         })}
    //     </div>
    // );

    return (
        <RadioButton
            value={answer}
            name="radio"
            className={styles.container}
            onChange={(value, optionData) => {
                setAnswer(value, nowIndex);
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
                            placeholder={option.label}
                            onChange={(e) => {
                                setCustomInput(e.target.value);
                                setAnswer(e.target.value);
                            }}
                        />
                    ) : null,
            }))}
            containerStyle={{ margin: ".5rem 0 1.5rem", width: "fit-content" }}
            labelStyle={{ fontSize: "0.938rem" }}
        />
    );
};

Option.propTypes = {
    nowIndex: PropTypes.number,
    question: PropTypes.shape({
        option: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string })),
    }),
    answer: PropTypes.number,
    setAnswer: PropTypes.func,
    setSkip: PropTypes.func,
};

export default Option;
