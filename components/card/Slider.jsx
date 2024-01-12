import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import styles from "./Slider.module.scss";

import { IoIosArrowForward } from "react-icons/io";

const SurveySlider = ({ title, list = [], card, getData, moreLink, moreCard, containerStyle, titleStyle }) => {
    const [surveyList, setSurveyList] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [isArrowLeft, setArrowLeft] = useState(false);
    const [isArrowRight, setArrowRight] = useState(false);
    const containerRef = useRef();
    const sliderRef = useRef();

    useEffect(() => {
        if (getData) {
            setLoading(true);
            getData()
                .then((resolve) => {
                    setSurveyList(resolve.lists.map((survey) => ({ ...survey, _id: survey._id })));
                })
                .catch((reject) => {
                    console.log(reject);
                    toast.error(reject);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, []);

    useEffect(() => {
        if (!isLoading) setArrowRight(containerRef.current?.offsetWidth < sliderRef.current?.offsetWidth);
    }, [isLoading]);

    useEffect(() => {
        if (list.length) {
            setSurveyList(list);
            setLoading(false);
        }
    }, [list]);

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.title} style={titleStyle}>
                <h4>{title}</h4>
                {moreLink(surveyList, isLoading)}
            </div>
            <div className={styles.slider_container}>
                {isArrowLeft && (
                    <div className={styles.more + " " + styles.left} style={{ width: sliderRef.current?.offsetWidth / 15 }}>
                        <div className={styles.gradient}>
                            <div
                                className={styles.arrow}
                                onClick={() => {
                                    let distance = offset - (containerRef.current.offsetWidth / 3) * 2;

                                    if (distance < 0) {
                                        distance = 0;
                                        setArrowLeft(false);
                                        setArrowRight(true);
                                    } else {
                                        setArrowRight(true);
                                    }

                                    setOffset(distance);
                                }}
                            >
                                <IoIosArrowForward />
                            </div>
                        </div>
                    </div>
                )}
                <div className={styles.slider} ref={sliderRef} style={{ ...containerStyle, left: -1 * offset }}>
                    {isLoading ? (
                        Array.from({ length: 6 }).map(() => {
                            return card({});
                        })
                        ) : !surveyList.length ? (
                            <div>Template kosong!</div>
                        ) : (
                        <>
                            {surveyList.map((survey) => {
                                return card(survey);
                            })}
                            {moreCard}
                        </>
                    )}
                </div>
                {isArrowRight && (
                    <div className={styles.more + " " + styles.right} style={{ width: sliderRef.current?.offsetWidth / 15 }}>
                        <div className={styles.gradient}>
                            <div
                                className={styles.arrow}
                                onClick={() => {
                                    let distance = offset + (containerRef.current.offsetWidth / 3) * 2;

                                    if (distance > sliderRef.current.offsetWidth - containerRef.current.offsetWidth) {
                                        distance = sliderRef.current.offsetWidth - containerRef.current.offsetWidth;
                                        setArrowRight(false);
                                        setArrowLeft(true);
                                    } else {
                                        setArrowLeft(true);
                                    }

                                    setOffset(distance);
                                }}
                            >
                                <IoIosArrowForward />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

SurveySlider.propTypes = {
    title: PropTypes.string,
    list: PropTypes.array,
    card: PropTypes.func,
    getData: PropTypes.func,
    moreLink: PropTypes.func,
    moreCard: PropTypes.node,
    containerStyle: PropTypes.object,
    titleStyle: PropTypes.object,
};

export default SurveySlider;
