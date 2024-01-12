import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Image from "next/image";
import { isMobile } from "detect-mobile-device";
import styles from "./Body.module.scss";

import { timeout } from "../../utils/functions";
import { userProfile } from "../../utils/recoil";
import { useRecoilValue } from "recoil";
import useModal from "../../utils/useModal";
import CopyIcon from "../../public/images/survey/copy_icon.png";
import QuestionBankIcon from "../../public/images/survey/question_bank_icon.png";
import { cloneSurvey, verifySurvey, unverifySurvey } from "../../utils/api/surveyApi";

import Toolbar from "../global/Toolbar";
import Question from "./question/Question";
import Settings from "./Settings";
import Result from "./result/Result";
import ModalPopup from "./modal/ModalPopup";

const Body = ({ survey, setSurvey, questionList, setQuestionList, isLoading, updateData, text, text_common, tooltip }) => {
    const containerRef = useRef();
    const [menu, setMenu] = useState("question"); // question, settings, result
    const [cloneLoading, setCloneLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const profile = useRecoilValue(userProfile);
    const { setData: setDataQuestion } = useModal("edit-question");
    const { setModal: setModalReset } = useModal("reset-answer");
    const { setModal: setModalClone } = useModal("clone-survey");
    const { setModal: setModalVerify } = useModal("verify-survey");
    const { setModal: setModalQuestionBank } = useModal("question-bank");
    const router = useRouter();

    useEffect(() => {
        if (containerRef.current) {
            const handleResize = () => {
                console.log("coeg");
                if (containerRef.current?.offsetWidth < 800) {
                    console.log("kurang");
                }
            };

            window.addEventListener("resize", handleResize);
            return window.removeEventListener("resize", handleResize);
        }
    }, [containerRef]);

    const cloneHandler = () => {
        console.log(survey);
        setCloneLoading(true);
        cloneSurvey({ surveyId: survey._id })
            .then(async () => {
                await timeout(2000);
                setCloneLoading(false);
                router.push("/survey-list?menu=draft");
                toast.info(text("success_clone_survey"));
                setCloneLoading(false);
                setModalClone(false);
            })
            .catch((reject) => {
                console.log(reject);
                setCloneLoading(false);
                toast.error(reject);
            });
    };

    const verifyHandler = () => {
        const surveyApi = survey.isVerified ? unverifySurvey : verifySurvey;

        setVerifyLoading(true);
        surveyApi(survey._id)
            .then(() => {
                toast.info(survey.isVerified ? text("success_unverify_title") : text("success_verify_title"));
                setSurvey({ ...survey, isVerified: !survey.isVerified });
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setVerifyLoading(false);
                setModalVerify(false);
            });
    };

    const buttonList = {
        clone_survey: {
            label: text("setting_clone_survey"),
            onClick: () => setModalClone(true),
            isTransparent: true,
            style: { borderRadius: ".375rem" },
            icon: isMobile() && <Image src={CopyIcon.src} alt="clone" width={24} height={24} />,
        },
        add_question: {
            label: "+ " + text("setting_add_question"),
            onClick: () => {
                setDataQuestion({});
            },
            style: { borderRadius: ".375rem" },
        },
        question_bank: {
            label: text("setting_question_bank"),
            onClick: () => {
                setModalQuestionBank(true);
            },
            isTransparent: true,
            style: { borderRadius: ".375rem" },
            icon: isMobile() && <Image src={QuestionBankIcon.src} alt="clone" width={24} height={24} />,
        },
        reset_answer: {
            label: text("setting_reset_answer"),
            onClick: () => {
                setModalReset(true);
            },
            isTransparent: true,
            style: { borderRadius: ".375rem" },
        },
        verify_survey: {
            label: survey.isVerified ? text("setting_unverify_survey") : text("setting_verify_survey"),
            onClick: () => setModalVerify(true),
            style: { borderRadius: ".375rem" },
        },
    };

    return (
        <main className={styles.container + (isMobile() ? " " + styles.mobile : "")} ref={containerRef}>
            <Toolbar
                render={["menu", "button"]}
                className={styles.header}
                menuList={{
                    value: menu,
                    onClick: (value) => setMenu(value),
                    options: [
                        {
                            label: text("setting_question"),
                            value: "question",
                        },
                        {
                            label: text("setting_customize"),
                            value: "customize",
                        },
                        {
                            label: text("setting_result"),
                            value: "result",
                        },
                    ],
                }}
                buttonList={
                    profile.level !== "user"
                        ? [buttonList.verify_survey]
                        : menu === "question" && survey.status !== "final"
                        ? isMobile()
                            ? [buttonList.add_question, buttonList.question_bank, buttonList.clone_survey]
                            : [buttonList.question_bank, buttonList.clone_survey, buttonList.add_question]
                        : menu === "question"
                        ? [buttonList.clone_survey]
                        : menu === "settings"
                        ? [buttonList.clone_survey]
                        : [buttonList.clone_survey, buttonList.reset_answer]
                }
            />
            <div className={styles.main_container}>
                {menu === "result" ? (
                    <Result questionList={questionList} isQuiz={survey.type === "quiz"} />
                ) : menu === "customize" ? (
                    <Settings survey={survey} updateData={updateData} tooltip={tooltip} text_common={text_common} />
                ) : (
                    <Question survey={survey} list={questionList} setList={setQuestionList} isLoading={isLoading} />
                )}
            </div>

            <ModalPopup
                modalIdentifier="clone-survey"
                title={text("warning_clone_title")}
                message={text("warning_clone_message")}
                buttonLabel={text("yes")}
                isLoading={cloneLoading}
                onSubmit={cloneHandler}
            />
            <ModalPopup
                modalIdentifier="verify-survey"
                title={text(survey.isVerified ? "warning_unverify_title" : "warning_verify_title")}
                message={text(survey.isVerified ? "warning_unverify_title" : "warning_verify_message")}
                buttonLabel={text("yes")}
                isLoading={verifyLoading}
                onSubmit={verifyHandler}
            />
        </main>
    );
};

Body.propTypes = {
    survey: PropTypes.object,
    setSurvey: PropTypes.func,
    questionList: PropTypes.array,
    setQuestionList: PropTypes.func,
    isLoading: PropTypes.bool,
    setLoading: PropTypes.func,
    updateData: PropTypes.func,
    deleteData: PropTypes.func,
    text: PropTypes.func,
    text_common: PropTypes.func,
    tooltip: PropTypes.shape({
        publish: PropTypes.string,
        limit: PropTypes.string,
        sharing: PropTypes.string,
    }),
};

export default Body;
