import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import intersection from "lodash.intersection";
import { auth } from "../../utils/useAuth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { userProfile } from "../../utils/recoil";
import { useRecoilValue } from "recoil";
import { getSurvey } from "../../utils/api/surveyApi";
import useModal from "../../utils/useModal";

import Spinner from "../../components/global/Spinner";
import Sidebar from "../../components/wrapper/sidebar/Sidebar";
import Header from "../../components/edit-survey/Header";
import Body from "../../components/edit-survey/Body";

import ModalQuestion from "../../components/edit-survey/question/ModalQuestion";
import ModalExport from "../../components/edit-survey/modal/ModalExport";
import ModalShare from "../../components/edit-survey/modal/ModalShare";
import ModalReward from "../../components/edit-survey/modal/ModalReward";
import ModalRefund from "../../components/edit-survey/modal/ModalRefund";
import ModalQuestionBank from "../../components/edit-survey/modal/QuestionBank";

const Edit = () => {
    const [survey, setSurvey] = useState({});
    const [questionList, setQuestionList] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isAuth, setAuth] = useState(false);
    const { setModal } = useModal("edit-question");
    const { t } = useTranslation("edit-survey");
    const { t: t_c } = useTranslation("common");
    const { t: tooltip } = useTranslation("tooltip");
    const profile = useRecoilValue(userProfile);
    const router = useRouter();
    const surveyId = router.query.surveyId;

    const checkPermission = (survey) => {
        return new Promise((resolve) => {
            let auth = false;

            if (survey.createdBy?.userId === profile.userId) auth = true;
            const group = intersection(
                survey?.groups.map((group) => group.groupId),
                profile?.groups.map((group) => group.groupId)
            );
            if (group.length) auth = true;

            if (auth) {
                setAuth(true);
                resolve();
            } else {
                toast.error("Access denied.");
                router.replace("/survey-list");
            }
        });
    };

    const getQuestion = () => {
        setLoading(true);
        getSurvey(surveyId)
            .then(async (resolve) => {
                if (!isAuth && profile.level === "user") await checkPermission(resolve);
                console.log(resolve);
                setSurvey(resolve);
                setQuestionList(resolve.questions || []);
                setLoading(false);
            })
            .catch((reject) => {
                if (reject === "not-found") {
                    toast.error("Survey not exist.");
                    router.replace("/survey-list");
                    return;
                }

                console.log(reject);
                setLoading(false);
                toast.error(reject);
            });
    };

    useEffect(() => {
        getQuestion();
    }, [surveyId]);

    if (isLoading)
        return (
            <Sidebar header="Edit Survey">
                <Spinner style={{ padding: "5rem" }} />
            </Sidebar>
        );
    return (
        <Sidebar header="Edit Survey">
            <Head>
                <title>{survey.title ? survey.title + " | Kutanya" : "Kutanya"}</title>
                <meta name="description" content={survey.description} />
            </Head>
            <Header
                survey={survey}
                updateData={(newData) => {
                    setSurvey({ ...survey, ...newData });
                }}
                t={t}
                t_c={t_c}
            />
            <Body
                survey={survey}
                setSurvey={setSurvey}
                questionList={questionList}
                setQuestionList={setQuestionList}
                id={surveyId}
                isLoading={isLoading}
                setLoading={setLoading}
                updateData={(newData) => {
                    setSurvey({ ...survey, ...newData });
                }}
                text={t}
                text_common={t_c}
                tooltip={{
                    publish: tooltip("publish"),
                    limit: tooltip("limit"),
                    sharing: tooltip("sharing"),
                }}
            />
            <ModalQuestion
                text={t}
                text_common={t_c}
                addData={(newData) => {
                    setQuestionList([...questionList, newData]);
                    setModal(false);
                }}
                updateData={(newData, index) => {
                    const array = [...questionList];
                    array.splice(index, 1, newData);
                    console.log(array);
                    setQuestionList(array);
                    setModal(false);
                }}
                deleteData={(index) => {
                    const array = [...questionList];
                    array.splice(index, 1);
                    setQuestionList(array);
                    setModal(false);
                }}
                surveyData={{ id: surveyId, questions: questionList?.map((x) => x._id), status: survey.status, type: survey.type }}
                isFinal={survey.status === "final"}
            />
            <ModalShare
                surveyName={survey.title}
                initialKey={survey.shareKey}
                text={{
                    title: t("share_long"),
                    qrcode: t("qrcode_title"),
                    download: t("qrcode_download"),
                }}
            />
            <ModalExport questionList={questionList} isQuiz={survey.type === "quiz"} />
            <ModalReward setSurvey={(data) => setSurvey({ ...survey, ...data })} />
            <ModalRefund setSurvey={(data) => setSurvey({ ...survey, ...data })} />
            <ModalQuestionBank setList={setQuestionList} />
        </Sidebar>
    );
};

export const getServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "tooltip", "edit-survey"])),
    },
});

export default auth(Edit);
