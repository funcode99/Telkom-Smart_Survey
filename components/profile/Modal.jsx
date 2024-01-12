import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./Modal.module.scss";

import useModal from "../../utils/useModal";
import { getAnswer } from "../../utils/api/answerApi";

import ModalContainer from "../modal/ModalContainer";
import { Button } from "../global/Button";
import Spinner from "../global/Spinner";

const Modal = () => {
    const [questionList, setQuestionList] = useState([]);
    const [answerList, setAnswerList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const { modal, setModal, data } = useModal("answer-detail");

    const getData = (answerId) => {
        setLoading(true);
        getAnswer(answerId)
            .then((resolve) => {
                setQuestionList(resolve.survey.questions);
                setAnswerList(resolve.answers);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (data.answerId) getData(data.answerId);
    }, [data]);

    return (
        <ModalContainer
            show={modal}
            onClose={() => {
                setQuestionList([]);
                setAnswerList([]);
            }}
            customContainer={{ width: "30rem" }}
        >
            <div className={styles.container}>
                {isLoading ? (
                    <Spinner />
                ) : (
                    <div className={styles.body}>
                        {questionList.map((question, index) => {
                            return (
                                <div key={index} className={styles.list}>
                                    <span className={styles.question}>
                                        {index + 1}. {question.label}
                                    </span>
                                    <span>{answerList?.[index]?.value || "-"}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
                <Button onClick={() => setModal(false)}>CLOSE</Button>
            </div>
        </ModalContainer>
    );
};

export default Modal;
