import { useState, useEffect } from "react";
import { auth } from "../../utils/useAuth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import styles from "./Survey.module.scss";

import { getSurvey } from "../../utils/api/surveyApi";

import Spinner from "../../components/global/Spinner";
import Intro from "../../components/survey/Intro";
import Question from "../../components/survey/Question.jsx";

const Survey = () => {
    const [survey, setSurvey] = useState({});
    const [questionList, setQuestionList] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const [surveyState, setSurveyState] = useState("normal");

    const [answers, setAnswers] = useState([]);
    const [nowIndex, setNowIndex] = useState(null);
    const [historyIndex, setHistoryIndex] = useState([]);

    const router = useRouter();
    const surveyId = router.query.surveyId;
    const { t: t_c } = useTranslation("common");

    const getData = () => {
        setLoading(true);
        getSurvey(surveyId)
            .then((resolve) => {
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
        console.log(answers);
        setSurveyState("submit_success");
    };

    return (
        <div className={styles.container}>
            <div className={styles.background} />
            <header className={styles.header}>
                <div>
                    <button onClick={() => router.back()}>{t_c("back")}</button>
                </div>
                <span>Preview Survey</span>
                <div />
            </header>
            {isLoading ? (
                <div className={styles.loading}>
                    <Spinner />
                </div>
            ) : (
                <div className={styles.content}>
                    {nowIndex === null ? (
                        <Intro
                            survey={survey}
                            onNext={() => {
                                if (questionList.length) {
                                    setNowIndex(0);
                                } else {
                                    toast.error("This survey not have a question.");
                                }
                            }}
                        />
                    ) : (
                        <Question
                            survey={survey}
                            question={questionList[nowIndex]}
                            nowIndex={nowIndex}
                            totalIndex={questionList.length}
                            answer={answers[nowIndex].value}
                            setAnswer={(index, value) => {
                                const newData = [...answers];
                                newData.splice(index, 1, { ...answers[index], value });
                                console.log(answers, newData, value);
                                setAnswers(newData);
                            }}
                            onPrevious={() => {
                                const history = [...historyIndex];
                                const lastIndex = history.pop();
                                setHistoryIndex(history);
                                setNowIndex(lastIndex);
                            }}
                            onNext={(skipTo) => {
                                if (nowIndex === answers.length - 1) {
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
                            successMessage={{
                                message: "This just preview version, your answer is not submitted.",
                                message_on_back: "Back to Edit Survey",
                                redirect: "/edit-survey/" + surveyId,
                            }}
                        />
                    )}
                </div>
            )}
            <footer>Powered by SmartSurvey. Copyright © 2021</footer>
        </div>
    );
};

export const getServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "survey"])),
    },
});

export default auth(Survey);
