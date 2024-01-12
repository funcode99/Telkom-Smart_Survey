import { useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import exportFromJSON from "export-from-json";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useTranslation } from "next-i18next";
import styles from "./ModalExport.module.scss";

import useModal from "../../../utils/useModal";
import { timeout } from "../../../utils/functions";
import { getAllAnswer, getSummaryResult } from "../../../utils/api/answerApi";

import ModalContainer from "../../modal/ModalContainer";
import Dropdown from "../../global/Dropdown";
import ResultSummary from "../result/ResultSummary";
import { ModalHeader as Header } from "../../global/Header";
import { ButtonContainer, Button } from "../../global/Button";

const ModalExport = ({ questionList, isQuiz }) => {
    const [input, setInput] = useState({ type: "question" });
    const [isLoading, setLoading] = useState(false);
    const [summaryList, setSummaryList] = useState([]);
    const { modal, setModal } = useModal("export-survey");
    const router = useRouter();
    const { t } = useTranslation("edit-survey");
    const { t: t_c } = useTranslation("common");

    const exportQuestion = () => {
        const data = questionList.map((question) => {
            const object = {
                Label: question.label,
                Type: question.inputType,
                Image: question.questionImage || "",
            };

            question.option?.forEach((option, optionIndex) => {
                object[`Option ${optionIndex + 1}`] = option.label;
            });

            return object;
        });

        const fileName = "Question Data";
        const exportType = exportFromJSON.types.xls;

        exportFromJSON({ data, fileName, exportType });
    };

    const exportAnswer = () => {
        setLoading(true);
        getAllAnswer({ surveyId: router.query.surveyId, page: 1, row: 1000 })
            .then((resolve) => {
                const data = resolve?.lists?.map((survey) => {
                    const object = {};

                    survey?.answers?.forEach((answer, index) => {
                        console.log(answer, questionList?.[index]);
                        object[`${index + 1}. ${questionList?.[index]?.label}`] = answer.value;
                    });

                    return object;
                });

                const fileName = "Answer Data";
                const exportType = exportFromJSON.types.xls;

                exportFromJSON({ data, fileName, exportType });
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const exportSummary = () => {
        setLoading(true);
        getSummaryResult({ surveyId: router.query.surveyId })
            .then(async (resolve) => {
                setSummaryList([]);
                setSummaryList(resolve?.questions?.filter((answer) => answer?.option?.length));
                await timeout(2000);
                setLoading(false);

                const input = document.getElementById("export-pdf");
                html2canvas(input).then((canvas) => {
                    const imgData = canvas.toDataURL("image/jpg");
                    const pdf = new jsPDF({
                        orientation: "potrait",
                    });
                    const imgProps = pdf.getImageProperties(imgData);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                    const pageCount = Math.ceil(imgProps.height / pdfHeight);
                    console.log(input.offsetHeight, input.clientHeight);
                    console.log(imgProps.height, pdfHeight, Math.ceil(imgProps.height / pdfHeight));
                    for (let i = 0; i < pageCount; i++) {
                        if (i !== 0) pdf.addPage();
                        pdf.addImage(imgData, "JPG", 0, -1 * (i * 295), pdfWidth, pdfHeight);
                    }
                    pdf.save("Summary_Data.pdf");
                });

                await timeout(2000);
                setSummaryList([]);
            })
            .catch((reject) => {
                console.log(reject);
                setLoading(false);
                toast.error(reject);
            });
    };

    return (
        <>
            <ModalContainer show={modal} isLoading={isLoading} customContainer={{ overflowY: "visible" }}>
                <Header title={t("result_download")?.replace("-value-", isQuiz ? "Quiz" : "Survey")} />
                <Dropdown
                    id="dropdown-export-survey"
                    options={[
                        { label: t_c("question"), value: "question" },
                        { label: t_c("answer"), value: "answer" },
                        { label: t("result_summary"), value: "summary" },
                    ]}
                    onSelect={(value) => {
                        setInput({ ...input, type: value });
                    }}
                    value={input.type}
                />
                <ButtonContainer style={{ marginTop: "1.5rem" }}>
                    <Button isTransparent onClick={() => setModal(false)}>
                        {t_c("cancel")}
                    </Button>
                    <Button
                        isLoading={isLoading}
                        onClick={() => {
                            switch (input.type) {
                                case "question":
                                    exportQuestion();
                                    break;
                                case "answer":
                                    exportAnswer();
                                    break;
                                case "summary":
                                    exportSummary();
                                    break;
                                default:
                                    break;
                            }
                        }}
                    >
                        {t_c("download")}
                    </Button>
                </ButtonContainer>
            </ModalContainer>
            {summaryList.length ? (
                <div className={styles.summary_container} id="export-pdf">
                    <ResultSummary preList={summaryList} isExport />
                </div>
            ) : null}
        </>
    );
};

ModalExport.propTypes = {
    questionList: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            inputType: PropTypes.string,
            questionImage: PropTypes.string,
            option: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string,
                })
            ),
        })
    ),
    isQuiz: PropTypes.bool,
};

export default ModalExport;
