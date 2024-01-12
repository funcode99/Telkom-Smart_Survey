import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styles from "./Survey.module.scss";

import { userProfile } from "../../utils/recoil";
import { useRecoilValue } from "recoil";
import { getSurveyPublic } from "../../utils/api/surveyApi";
import { createAnswer, createAnswerAnonymous } from "../../utils/api/answerApi";
import useModal from "../../utils/useModal";

import Spinner from "../../components/global/Spinner";
import ProgressBar from "../../components/global/ProgressBar";
import Header from "../../components/survey/Header";
import Intro from "../../components/survey/Intro";
import Question from "../../components/survey/Question.jsx";
import NotFound from "../../components/survey/NotFound";
import ModalLogin from "../../components/modal/ModalLogin";

const Survey = () => {
    const [anonymous, setAnonymous] = useState({ email: "", name: "" });
    const [survey, setSurvey] = useState({});
    const [questionList, setQuestionList] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const [surveyState, setSurveyState] = useState("normal"); // normal, submit_success, not_found
    const [isSubmitLoading, setSubmitLoading] = useState(false);

    const [answers, setAnswers] = useState([]);
    const [nowIndex, setNowIndex] = useState(null);
    const [historyIndex, setHistoryIndex] = useState([]);

    const { setModal } = useModal("popup-login");
    const profile = useRecoilValue(userProfile);
    const router = useRouter();
    const surveyId = router.query.surveyId;

    const getData = () => {
        setLoading(true);
        getSurveyPublic(surveyId)
            .then((resolve) => {
                console.log(resolve);

                if (resolve.status !== "final" && resolve.createdBy !== profile.userId) {
                    return setSurveyState("not_found");
                }

                if (resolve.isExpired) {
                    return setSurveyState("not_found");
                }

                setSurvey(resolve);
                setQuestionList(resolve.questions);
                setAnswers(
                    resolve.questions.map((question) => ({
                        questionId: question._id,
                        value: "",
                    }))
                );
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
        if (surveyId) getData(surveyId);
    }, [router.query]);

    const submitHandler = () => {
        const submitAnswer = anonymous.name ? createAnswerAnonymous : createAnswer;
        const param = anonymous.name ? { ...anonymous } : {};
        setSubmitLoading(true);
        submitAnswer({ ...param, surveyId, answers: answers.filter((exist) => exist) })
            .then(() => {
                setSurveyState("submit_success");
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setSubmitLoading(false);
            });
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>{survey.title ? survey.title + " | Kutanya" : "Kutanya"}</title>
                <meta name="description" content={survey.description} />
            </Head>
            <Header anonymous={anonymous} />
            <ProgressBar show={isSubmitLoading} />
            <div className={styles.background} />
            <div className={styles.logo}></div>
            {isLoading ? (
                <div className={styles.loading}>
                    <Spinner />
                </div>
            ) : (
                <div className={styles.content}>
                    {surveyState === "not_found" ? (
                        <NotFound />
                    ) : nowIndex === null ? (
                        <Intro
                            survey={survey}
                            onNext={() => {
                                if (!profile.userId) {
                                    setModal(true);
                                } else if (questionList.length) {
                                    setNowIndex(0);
                                } else {
                                    toast.error("This survey not have a question.");
                                }
                            }}
                            showReward
                        />
                    ) : (
                        <Question
                            survey={survey}
                            question={questionList[nowIndex]}
                            nowIndex={nowIndex}
                            totalIndex={questionList.length}
                            isDisabled={!answers[nowIndex].value?.length || isSubmitLoading}
                            answer={answers[nowIndex].value}
                            setAnswer={(index, value) => {
                                const newData = [...answers];
                                newData.splice(index, 1, { ...answers[index], value });
                                setAnswers(newData);
                            }}
                            onPrevious={() => {
                                const history = [...historyIndex];
                                const lastIndex = history.pop();
                                setHistoryIndex(history);
                                setNowIndex(lastIndex);
                            }}
                            onNext={(skipTo) => {
                                if (nowIndex === answers.length - 1 && answers[nowIndex].value) {
                                    submitHandler();
                                } else {
                                    const history = [...historyIndex];
                                    history.push(nowIndex);
                                    setHistoryIndex(history);

                                    const isSkip = skipTo > nowIndex;
                                    setNowIndex(isSkip ? skipTo : nowIndex + 1);
                                }
                            }}
                            isSuccess={surveyState === "submit_success"}
                        />
                    )}
                </div>
            )}
            <footer>Powered by Kutanya. Copyright © 2022</footer>
            <ModalLogin
                popupSuccess={(input) => {
                    setAnonymous(input || {});
                    setNowIndex(0);
                }}
                isAnonymous={survey.respondentType !== "registered"}
            />
        </div>
    );
};

export const getServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "survey", "login"])),
    },
});

export default Survey;
