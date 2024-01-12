import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import styles from "./ResultScore.module.scss";

import { getSummaryResultQuiz } from "../../../utils/api/answerApi";

import Spinner from "../../global/Spinner";

const colors = [
    "#A166AB",
    "#0AB39C",
    "#F1963A",
    "#574099",
    "#5F6235",
    "#5E29C9",
    "#F697D1",
    "#8E5BA5",
    "#BF665E",
    "#098ACF",
    "#649152",
    "#4EDC58",
    "#6B478D",
];

const ResultScore = ({ isReset }) => {
    const [scoreList, setScoreList] = useState([]);
    // const [totalData, setTotalData] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [transition, setTransition] = useState(false);
    const chartRef = useRef();
    const router = useRouter();

    const getData = () => {
        setLoading(true);
        getSummaryResultQuiz(router.query.surveyId)
            .then((resolve) => {
                console.log(resolve);
                setScoreList(resolve.lists.sort((a, b) => b.totalPoint - a.totalPoint));
                // setTotalData(resolve.totalData);
                setTimeout(() => {
                    setTransition(true);
                }, 100);
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

    useEffect(() => {
        if (isReset) {
            setScoreList([]);
        }
    }, [isReset]);

    return (
        <div className={styles.container}>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className={styles.body}>
                    <div className={styles.list + " " + styles.number}>
                        {scoreList.map((_, index) => {
                            return <div key={index}>{index + 1}.</div>;
                        })}
                    </div>
                    <div className={styles.list + " " + styles.name}>
                        {scoreList.map((score, index) => {
                            return <div key={index}>{score.user.name}</div>;
                        })}
                    </div>
                    <div className={styles.list + " " + styles.score}>
                        {scoreList.map((score, index) => {
                            return (
                                <div key={index} className={styles.chart} ref={index === 0 ? chartRef : null}>
                                    <div
                                        style={{
                                            background: colors[index % colors.length],
                                            width:
                                                score.totalPoint &&
                                                transition &&
                                                (index ? `${(100 / scoreList[0].totalPoint) * score.totalPoint}%` : "100%"),
                                        }}
                                    />
                                    <span>{score.totalPoint}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

ResultScore.propTypes = {
    isReset: PropTypes.bool,
};

export default ResultScore;
