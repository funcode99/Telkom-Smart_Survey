import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styles from "./Survey.module.scss";

import { userProfile } from "../../utils/recoil";
import { useRecoilValue } from "recoil";
import { getSurvey, getSurveyPublic } from "../../utils/api/surveyApi";

import Spinner from "../../components/global/Spinner";
import Sidebar from "../../components/survey/Sidebar";
import Intro from "../../components/survey/Intro";
import Question from "../../components/survey/Question.jsx";
import ModalLogin from "../../components/modal/ModalLogin";

const Survey = () => {
    const [survey, setSurvey] = useState({});
    const [questionList, setQuestionList] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const profile = useRecoilValue(userProfile);

    const [answers, setAnswers] = useState([]);
    const [nowIndex, setNowIndex] = useState(null);
    const [historyIndex, setHistoryIndex] = useState([]);

    const router = useRouter();
    const surveyId = router.query.surveyId;
    const { t: t_c } = useTranslation("common");

    const getData = () => {
        const fetchSurvey = profile.userId ? getSurvey : getSurveyPublic;

        setLoading(true);
        fetchSurvey(surveyId)
            .then((resolve) => {
                console.log(resolve);
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

    return (
        <div className={styles.container}>
            <div className={styles.background} />

            {isLoading ? (
                <div className={styles.loading}>
                    <Spinner />
                </div>
            ) : (
                <>
                    <div className={styles.content}>
                        <header className={styles.header}>
                            <button onClick={() => router.back()}>{t_c("back")}</button>
                            <span>Preview Survey</span>
                        </header>
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
                                button="View Survey"
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
                                    setAnswers(newData);
                                }}
                                onPrevious={() => {
                                    const history = [...historyIndex];
                                    const lastIndex = history.pop();
                                    setHistoryIndex(history);
                                    setNowIndex(lastIndex);
                                }}
                                onNext={(skipTo) => {
                                    const history = [...historyIndex];
                                    history.push(nowIndex);
                                    setHistoryIndex(history);

                                    const isSkip = skipTo > nowIndex;
                                    setNowIndex(isSkip ? skipTo : nowIndex + 1);
                                }}
                                hideSubmit={questionList.length - 1 === nowIndex}
                            />
                        )}
                    </div>
                    <Sidebar survey={survey} isLogin={profile.userId ? true : false} t_c={t_c} />
                </>
            )}
            <footer>Powered by SmartSurvey. Copyright © 2021</footer>
            <ModalLogin
                popupSuccess={() => {
                    router.replace(router.asPath);
                    toast.info("Login success.");
                }}
            />
        </div>
    );
};

export const getServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "survey", "store", "login"])),
    },
});

export default Survey;
