import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import styles from "./ResultIndividual.module.scss";

import useModal from "../../../utils/useModal";
import { MdClose } from "react-icons/md";
import { deleteAnswer, getAllAnswer } from "../../../utils/api/answerApi";
import NotFoundIcon from "../../../public/images/survey/result_not_found_icon.svg";

import Spinner from "../../global/Spinner";
import ResultBar from "./ResultBar";
import Popup from "../../global/Popup";

const ResultIndividual = ({ questionList, isReset, t, t_c }) => {
    const [answerList, setAnswerList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("newest");
    const [isLoading, setLoading] = useState(true);
    const [deleteData, setDeleteData] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { modal, setModal } = useModal("delete-result");
    const router = useRouter();

    const deleteHandler = (answerId) => {
        setDeleteLoading(true);
        deleteAnswer(answerId)
            .then((resolve) => {
                console.log(resolve);
                toast.info("Delete answer success.");
                setModal(false);
                getAnswer(1);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setDeleteLoading(false);
            });
    };

    const getAnswer = (page) => {
        setLoading(true);
        getAllAnswer({ surveyId: router.query.surveyId, page })
            .then((resolve) => {
                console.log(resolve);
                setAnswerList(resolve.lists);
                setTotalData(resolve.totalData);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                console.log("finish");
                setLoading(false);
            });
    };

    useEffect(() => {
        getAnswer(page);
    }, [page]);

    useEffect(() => {
        if (isReset) {
            setAnswerList([]);
            setTotalData(0);
        }
    }, [isReset]);

    return (
        <>
            <ResultBar totalData={totalData} page={page} setPage={setPage} sort={sort} setSort={setSort} t={t_c} />
            {isLoading ? (
                <Spinner style={{ margin: "5rem 0" }} />
            ) : !answerList.length ? (
                <div className={styles.empty_container}>
                    <NotFoundIcon />
                    <label>{t("empty_result_title")}</label>
                </div>
            ) : (
                <>
                    <table className={styles.container} cellSpacing={0}>
                        <thead>
                            <tr>
                                <th className={styles.left}>{t_c("question")}</th>
                                <th className={styles.center}>
                                    <div className={styles.header}>
                                        <span>{answerList[0]?.user?.email || answerList[0]?.user?.name}</span>
                                        {answerList[0]?._id && (
                                            <MdClose
                                                onClick={() => {
                                                    setDeleteData(answerList[0]);
                                                    setModal(true);
                                                }}
                                            />
                                        )}
                                    </div>
                                </th>
                                <th className={styles.right}>
                                    <div className={styles.header}>
                                        <span>{answerList[1]?.user?.email || answerList[1]?.user?.name}</span>
                                        {answerList[1]?._id && (
                                            <MdClose
                                                onClick={() => {
                                                    setDeleteData(answerList[1]);
                                                    setModal(true);
                                                }}
                                            />
                                        )}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionList.map((question, index) => {
                                const getValue = (value) => {
                                    if (typeof value === "object") {
                                        return value?.join(", ");
                                    } else {
                                        return value;
                                    }
                                };

                                return (
                                    <tr style={{ background: index % 2 === 0 && "#F9F9FF" }} key={index}>
                                        <td className={styles.left}>
                                            {index + 1}. {question.label}
                                        </td>
                                        <td className={styles.center}>{getValue(answerList[0]?.answers?.[index]?.value)}</td>
                                        <td className={styles.right}>{getValue(answerList[1]?.answers?.[index]?.value)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            )}
            <Popup
                show={modal}
                onClose={() => {
                    setDeleteData(null);
                }}
                modalProps={{ isLoading: deleteLoading }}
                title={`Delete this answer by ${deleteData?.user?.email || deleteData?.user?.name}?`}
                cancelButton={{
                    onClick: () => setModal(false),
                    isDisabled: isLoading,
                }}
                submitButton={{
                    onClick: () => deleteHandler(deleteData._id),
                    isLoading: deleteLoading,
                }}
            />
        </>
    );
};

ResultIndividual.propTypes = {
    questionList: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
        })
    ),
    isReset: PropTypes.bool,
    t: PropTypes.func,
    t_c: PropTypes.func,
};

export default ResultIndividual;
