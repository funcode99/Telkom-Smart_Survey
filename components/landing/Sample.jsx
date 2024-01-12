import { useState, useEffect } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import styles from "./Sample.module.scss";

import { BiDownload } from "react-icons/bi";
import { getAllSurveyPublic } from "../../utils/api/surveyApi";

import { Button } from "../global/Button";
import Card from "../card/SurveyCard";
import { toast } from "../../node_modules/react-toastify/dist/index";

const Sample = ({ elementRef, t }) => {
    const [questionList, setQuestionList] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const getData = () => {
        setLoading(true);
        getAllSurveyPublic({ row: 6, page: 1, isVerified: true })
            .then((resolve) => {
                console.log(resolve);
                setQuestionList(resolve.lists.map((survey) => ({ ...survey, _id: survey._id })));
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
        <div className={styles.container} ref={elementRef}>
            <div className={styles.body}>
                <div className={styles.title}>
                    <h2>{t("sample_content")}</h2>
                    <p>{t("sample_content_body")}</p>
                </div>
                <div className={styles.card_container}>
                    {isLoading
                        ? Array.from({ length: 6 }).map((_, index) => {
                              return <Card survey={{}} key={index} />;
                          })
                        : questionList.map((survey) => {
                              return (
                                  <Card
                                      survey={survey}
                                      key={survey._id}
                                      href={"/detail-survey/" + survey._id}
                                      footer={
                                          <div className={styles.footer}>
                                              <BiDownload />
                                              <span>
                                                  <b>{survey.totalUsed}</b> Used
                                              </span>
                                          </div>
                                      }
                                  />
                              );
                          })}
                </div>
                <Link href="/public/store">
                    <a>
                        <Button style={{ width: "12.875rem" }} isTransparent>
                            {t("sample_button_text")}
                        </Button>
                    </a>
                </Link>
            </div>
        </div>
    );
};

Sample.propTypes = {
    elementRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.elementType })]),
    t: PropTypes.func,
};

export default Sample;
