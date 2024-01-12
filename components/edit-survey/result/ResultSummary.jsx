import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import moment from "moment";
import { DateTimePicker } from "@material-ui/pickers";
import { Doughnut, Bar } from "react-chartjs-2";
import { useTranslation } from "next-i18next";
import styles from "./ResultSummary.module.scss";

import DateIcon from "../../../public/images/survey/date_icon.svg";
import { BsCircleFill } from "react-icons/bs";
import { getSummaryResult } from "../../../utils/api/answerApi";
import NotFoundIcon from "../../../public/images/survey/result_not_found_icon.svg";

import options from "./options";
import Toolbar from "../../global/Toolbar";
import Spinner from "../../global/Spinner";

const colors = ["#5073B8", "#0AB39C", "#F1963A", "#F16548", "#A166AB"];
const formatData = (data, isBar) => {
    return {
        labels: data.option?.map((option) => option.label),
        datasets: [
            {
                data: data.option?.map((option) => option.totalChoice),
                backgroundColor: colors,
                borderWidth: [0],
                maxBarThickness: 60,
                borderRadius: isBar && 5,
            },
        ],
    };
};

const ResultSummary = ({ preList = [], isReset, isExport }) => {
    const [input, setInput] = useState({
        startDate: null,
        endDate: null,
    });
    const [mode, setMode] = useState("doughnut");
    const [summaryList, setSummaryList] = useState(preList);
    const [isLoading, setLoading] = useState(isExport ? false : true);
    const { t } = useTranslation("edit-survey");
    const router = useRouter();

    const getData = () => {
        setLoading(true);
        getSummaryResult({ surveyId: router.query.surveyId, startDate: input.startDate, endDate: input.endDate })
            .then((resolve) => {
                setSummaryList(resolve?.questions?.filter((answer) => answer?.option?.length));
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
        if (!preList.length) getData(input);
    }, [input]);

    useEffect(() => {
        if (isReset) {
            setSummaryList([]);
        }
    }, [isReset]);

    if (isLoading) return <Spinner style={{ margin: "5rem 0" }} />;

    return (
        <div className={styles.container} key={mode}>
            {!isExport && (
                <div className={styles.toolbar}>
                    <Toolbar
                        render={["menu"]}
                        menuList={{
                            value: mode,
                            options: [
                                { label: `${t("result_graphic")} Pie`, value: "doughnut" },
                                { label: `${t("result_graphic")} Bar`, value: "bar" },
                            ],
                            onClick: (value) => setMode(value),
                        }}
                        menuStyle={{
                            boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
                            margin: 0,
                        }}
                        style={{
                            margin: 0,
                        }}
                    />
                    <div className={styles.datepicker_container}>
                        <div className={styles.datepicker_input}>
                            <DateTimePicker
                                TextFieldComponent={(prop) => {
                                    return <input onClick={prop.onClick} value={prop.value} onChange={prop.onChange} />;
                                }}
                                // ampm={false}
                                format="DD MMMM yyyy HH:mm"
                                value={input.startDate ? moment(input.startDate).toDate() : null}
                                emptyLabel="Start Date"
                                onChange={(date) => {
                                    console.log(date.valueOf(), moment(input.endDate).valueOf(), date.valueOf() > moment(input.endDate).valueOf());
                                    setInput({
                                        ...input,
                                        startDate: date.format("YYYY-MM-DDTHH:mmZ"),
                                        endDate:
                                            !input.endDate || date.valueOf() > moment(input.endDate).valueOf()
                                                ? date.add(1, "day").format("YYYY-MM-DDTHH:mmZ")
                                                : input.endDate,
                                    });
                                }}
                            />
                            <DateIcon />
                        </div>
                        <div className={styles.datepicker_input}>
                            <DateTimePicker
                                TextFieldComponent={(prop) => {
                                    return <input onClick={prop.onClick} value={prop.value} onChange={prop.onChange} />;
                                }}
                                // ampm={false}
                                format="DD MMMM yyyy HH:mm"
                                value={input.endDate ? moment(input.endDate).toDate() : null}
                                emptyLabel="End Date"
                                onChange={(date) => {
                                    setInput({
                                        ...input,
                                        endDate: date.format("YYYY-MM-DDTHH:mmZ"),
                                        startDate:
                                            !input.startDate || date.valueOf() < moment(input.startDate).valueOf()
                                                ? date.format("YYYY-MM-DDTHH:mmZ")
                                                : input.startDate,
                                    });
                                }}
                            />
                            <DateIcon />
                        </div>
                    </div>
                </div>
            )}
            {!summaryList.length ? (
                <div className={styles.empty_container}>
                    <NotFoundIcon />
                    <label>{t("empty_result_title")}</label>
                </div>
            ) : (
                summaryList.map((summary) => {
                    const totalAnswer = summary.option.reduce((acc, option) => {
                        return acc + option.totalChoice;
                    }, 0);

                    return (
                        <div className={styles.card} key={summary._id}>
                            <div className={styles.question} style={{ minWidth: mode === "bar" && "100%" }}>
                                {summary.label}
                            </div>
                            <div className={styles.chart_container}>
                                {mode === "doughnut" ? (
                                    <>
                                        <div className={styles.chart_doughnut}>
                                            <Doughnut
                                                data={
                                                    totalAnswer
                                                        ? formatData(summary)
                                                        : {
                                                              labels: ["No option selected"],
                                                              datasets: [
                                                                  {
                                                                      data: [1],
                                                                      backgroundColor: ["#ababab"],
                                                                      borderWidth: [0],
                                                                  },
                                                              ],
                                                          }
                                                }
                                                options={options("doughnut")}
                                            />
                                            <div className={styles.center}>
                                                <label>{totalAnswer}</label>
                                                <span>Total {t("answer")}</span>
                                            </div>
                                        </div>
                                        <div className={styles.legend}>
                                            {summary?.option.map((option, index) => {
                                                return (
                                                    <div key={option._id}>
                                                        <BsCircleFill style={{ color: colors[index % colors.length] }} />
                                                        <label>{option.label}</label>
                                                        <span>
                                                            {option.totalChoice} {t("answer")}{" "}
                                                            {totalAnswer
                                                                ? `(${parseFloat(((option.totalChoice / totalAnswer) * 100).toFixed(1))}%)`
                                                                : "(0%)"}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <div className={styles.chart_bar}>
                                        <Bar data={formatData(summary, true)} options={options("bar")} />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

ResultSummary.propTypes = {
    preList: PropTypes.array,
    isReset: PropTypes.bool,
    isExport: PropTypes.bool,
};

export default ResultSummary;
