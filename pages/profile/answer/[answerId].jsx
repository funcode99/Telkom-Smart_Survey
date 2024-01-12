import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styles from "./Answer.module.scss";

import { getAnswer } from "../../../utils/api/answerApi";
import { IoMdArrowRoundBack } from "react-icons/io";

import Sidebar from "../../../components/wrapper/sidebar/Sidebar";
import { PageHeader as Header } from "../../../components/global/Header";
import { Button } from "../../../components/global/Button";
import Spinner from "../../../components/global/Spinner";

const DetailSurvey = () => {
    const [survey, setSurvey] = useState({});
    const [answerList, setAnswerList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useTranslation("profile");
    const { t: t_c } = useTranslation("common");

    const getData = () => {
        setLoading(true);
        getAnswer(router.query?.answerId)
            .then((resolve) => {
                console.log(resolve);
                setSurvey(resolve.survey);
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
        getData();
    }, []);

    return (
        <Sidebar>
            <Header title={t("survey_detail_title")} />
            <div className={styles.container}>
                <div className={styles.title}>
                    <Button isTransparent onClick={() => router.push("/profile")}>
                        {
                            <div className={styles.back}>
                                <IoMdArrowRoundBack />
                                <span>{t_c("back")}</span>
                            </div>
                        }
                    </Button>
                    <h3>{survey.title}</h3>
                </div>
                {isLoading ? (
                    <Spinner style={{ padding: "5rem" }} />
                ) : (
                    <table className={styles.table} cellSpacing={0}>
                        <thead>
                            <tr>
                                <th className={styles.left}>{t_c("question")}</th>
                                <th className={styles.right}>{t_c("answer")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {survey?.questions?.map((question, index) => {
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
                                        <td className={styles.right}>{getValue(answerList[index]?.value)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </Sidebar>
    );
};

export const getServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "profile"])),
    },
});

export default DetailSurvey;
