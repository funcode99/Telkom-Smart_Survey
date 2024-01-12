import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import styles from "./Result.module.scss";

import { timeout } from "../../../utils/functions";

import ResultIndividual from "./ResultIndividual";
import ResultSummary from "./ResultSummary";
import ResultScore from "./ResultScore";
import ModalReset from "./ModalReset";

const Result = ({ questionList, isQuiz }) => {
    const [mode, setMode] = useState("individual");
    const [isReset, setReset] = useState(false);

    const { t } = useTranslation("edit-survey");
    const { t: t_c } = useTranslation("common");

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <label className={mode === "individual" ? styles.active : null} onClick={() => setMode("individual")}>
                    {t("result_individual")}
                </label>
                <label className={mode === "summary" ? styles.active : null} onClick={() => setMode("summary")}>
                    {t("result_summary")}
                </label>
                {isQuiz && (
                    <label className={mode === "score" ? styles.active : null} onClick={() => setMode("score")}>
                        {t("result_score")}
                    </label>
                )}
            </div>
            {mode === "individual" ? (
                <ResultIndividual questionList={questionList} isReset={isReset} t={t} t_c={t_c} />
            ) : mode === "summary" ? (
                <ResultSummary isReset={isReset} t={t} t_c={t_c} />
            ) : (
                <ResultScore isReset={isReset} />
            )}
            <ModalReset
                onSuccess={async () => {
                    setReset(true);
                    await timeout(1000);
                    setReset(false);
                }}
            />
        </div>
    );
};

Result.propTypes = {
    questionList: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string })),
    isQuiz: PropTypes.bool,
};

export default Result;
