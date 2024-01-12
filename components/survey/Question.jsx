import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import Image from "next/image";
// import { toast } from "react-toastify";
import styles from "./Question.module.scss";

// import { HiOutlineTrash } from "react-icons/hi";
// import { uploadFile, toBase64 } from "../../utils/functions";

import Success from "./Success";
import { Button, ButtonContainer } from "../global/Button";
import Dummy from "../../public/images/survey/default_banner.jpg";

const Range = dynamic(() => import("./input/Range"));
const UploadImage = dynamic(() => import("./input/Image"));
const Option = dynamic(() => import("./input/Option"));
const Checkbox = dynamic(() => import("./input/Checkbox"));

const Question = ({
    survey,
    question,
    answer,
    setAnswer,
    nowIndex,
    totalIndex,
    isDisabled,
    onNext,
    onPrevious,
    isSuccess,
    successMessage = {},
    hideSubmit,
}) => {
    const [isSkip, setSkip] = useState(null);

    useEffect(() => {
        const option = question?.option?.find((opt) => {
            return opt.label === answer;
        });
        if (option) {
            setSkip(option?.skipTo - 1);
        } else {
            setSkip(null);
        }
    }, [nowIndex]);

    // useEffect(() => {
    //     if (!answer && !["option", "radio", "checkbox"].includes(question.inputType)) return;
    //     const checkCustom = question?.option?.some((option) => option.label === answer);
    //     setCustomInput(!checkCustom ? answer : "");
    // }, [nowIndex]);

    useEffect(() => {
        console.log(answer);
    }, [answer]);

    return (
        <main className={styles.container}>
            <div className={styles.banner}>
                <Image alt="banner" effect="blur" src={survey.surveyImage ? survey.surveyImage : Dummy.src} layout="fill" objectFit="cover" />
                <div className={styles.overlay} />
                <div className={styles.title}>
                    <h3>{survey.title}</h3>
                </div>
            </div>
            {isSuccess ? (
                <Success message={successMessage.message} message_on_back={successMessage.message_on_back} redirect={successMessage.redirect} />
            ) : (
                <div className={styles.content}>
                    <span className={styles.info}>
                        Question {nowIndex + 1} of {totalIndex}
                    </span>
                    {question.questionImage && (
                        <div className={styles.image}>
                            <Image alt="image" src={question.questionImage} layout="fill" objectFit="contain" />
                        </div>
                    )}
                    <p className={styles.label}>{question.label}</p>
                    <div className={styles.input}>
                        {["option", "radio"].includes(question.inputType) ? (
                            <Option
                                nowIndex={nowIndex}
                                question={question}
                                answer={answer}
                                setAnswer={(value) => {
                                    setAnswer(nowIndex, value);
                                }}
                                setSkip={setSkip}
                            />
                        ) : question.inputType === "checkbox" ? (
                            <Checkbox
                                nowIndex={nowIndex}
                                question={question}
                                answer={answer}
                                setAnswer={(value) => {
                                    setAnswer(nowIndex, value);
                                }}
                                setSkip={setSkip}
                            />
                        ) : ["file", "file-image"].includes(question.inputType) ? (
                            <UploadImage
                                answer={answer}
                                setAnswer={(value) => {
                                    setAnswer(nowIndex, value);
                                }}
                            />
                        ) : question.inputType === "range" ? (
                            <Range
                                question={question}
                                answer={parseInt(answer)}
                                setAnswer={(value) => {
                                    setAnswer(nowIndex, value);
                                }}
                            />
                        ) : (
                            <textarea
                                required
                                value={answer}
                                rows={4}
                                placeholder="Enter the answer"
                                onChange={(e) => {
                                    setAnswer(nowIndex, e.target.value);
                                }}
                            />
                        )}
                    </div>
                    <ButtonContainer style={{ height: "2.25rem", flex: 0 }}>
                        {nowIndex !== 0 && (
                            <Button onClick={onPrevious} isTransparent>
                                Previous
                            </Button>
                        )}
                        {!hideSubmit && (
                            <Button
                                onClick={() => onNext(isSkip)}
                                isDisabled={isDisabled}
                                style={{ marginLeft: nowIndex === 0 && "auto", cursor: isDisabled && "default", opacity: isDisabled && 0.5 }}
                            >
                                {nowIndex === totalIndex - 1 ? "Submit" : "Next"}
                            </Button>
                        )}
                    </ButtonContainer>
                </div>
            )}
        </main>
    );
};

Question.propTypes = {
    survey: PropTypes.shape({
        title: PropTypes.string,
        surveyImage: PropTypes.string,
    }),
    nowIndex: PropTypes.number,
    totalIndex: PropTypes.number,
    question: PropTypes.shape({
        label: PropTypes.string,
        inputType: PropTypes.string,
        option: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                value: PropTypes.string,
            })
        ),
        questionImage: PropTypes.string,
    }),
    answer: PropTypes.string,
    setAnswer: PropTypes.func,
    isDisabled: PropTypes.bool,
    setQuestion: PropTypes.func,
    onNext: PropTypes.func,
    onPrevious: PropTypes.func,
    successMessage: PropTypes.shape({
        message: PropTypes.string,
        message_on_back: PropTypes.string,
        redirect: PropTypes.string,
    }),
    isSuccess: PropTypes.bool,
    hideSubmit: PropTypes.bool,
};

export default Question;
