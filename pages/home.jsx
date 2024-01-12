import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Home.module.scss";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import AddIcon from "../public/images/home/add_icon.svg";
import NextIcon from "../public/images/home/next_icon.svg";
import NotFoundIcon from "../public/images/home/not_found_icon.svg";
import { userProfile } from "../utils/recoil";
import { useRecoilValue } from "recoil";
import useModal from "../utils/useModal";
import { auth } from "../utils/useAuth";
import { getAllSurvey } from "../utils/api/surveyApi";

import Sidebar from "../components/wrapper/sidebar/Sidebar";
import Card from "../components/card/SurveyCard";
import Slider from "../components/card/Slider";
import Modal from "../components/home/Modal";
// import Tour from "../components/home/Tour";

const Home = () => {
    const [isLoading, setLoading] = useState(false);
    const [recentList, setRecentList] = useState([]);
    const { setModal } = useModal("new-survey");
    const profile = useRecoilValue(userProfile);
    const { t } = useTranslation("home");
    const { t: t_c } = useTranslation("common");

    // const [tourIndex, setTourIndex] = useState(null);
    // const [tourPosition1, setPosition1] = useState({ top: 0, left: 0, width: 0, height: 0 });
    // const [tourPosition2, setPosition2] = useState({ top: 0, left: 0, width: 0, height: 0 });
    // const [tourPosition3, setPosition3] = useState({ top: 0, left: 0, width: 0, height: 0 });
    // const [tourPosition4, setPosition4] = useState({ top: 0, left: 0, width: 0, height: 0 });
    // const [tourPosition5, setPosition5] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const tour1 = useRef();
    const tour2 = useRef();
    const tour3 = useRef();
    const tour4 = useRef();
    const tour5 = useRef();

    const getData = () => {
        setLoading(true);
        getAllSurvey({ row: 8, userId: profile.userId })
            .then((resolve) => {
                console.log(resolve?.lists);
                setRecentList(resolve?.lists);
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

    // useEffect(() => {
    //     const tourState = window.localStorage.getItem("tourState");
    //     console.log(tourState);
    //     if (tourState) {
    //         const tourData = JSON.parse(tourState);
    //         if (!tourData?.[profile.userId]?.home) setTourIndex(0);
    //     }
    // }, []);

    // const getPosition = (index) => {
    //     switch (index) {
    //         case 1:
    //             return tourPosition1;
    //         case 2:
    //             return tourPosition2;
    //         case 3:
    //             return tourPosition3;
    //         case 4:
    //             return tourPosition4;
    //         case 5:
    //             return tourPosition5;
    //         default:
    //             return { top: 0, left: 0, width: 0, height: 0 };
    //     }
    // };

    // const resizeHandler = (ref, setPosition) => {
    //     const viewportOffset = ref.current?.getBoundingClientRect();
    //     const width = ref.current?.offsetWidth + 20;
    //     const height = ref.current?.offsetHeight + 20;
    //     const top = viewportOffset?.top - 10;
    //     const left = viewportOffset?.left - 10;

    //     setPosition({ top, left, width, height });
    // };

    // useEffect(() => {
    //     const resize = () => {
    //         resizeHandler(tour1, setPosition1);
    //         resizeHandler(tour2, setPosition2);
    //         resizeHandler(tour3, setPosition3);
    //         resizeHandler(tour4, setPosition4);
    //         resizeHandler(tour5, setPosition5);
    //     };

    //     resize();
    //     window.addEventListener("resize", resize);

    //     return function cleanup() {
    //         window.removeEventListener("resize", resize);
    //     };
    // }, []);

    return (
        <Sidebar tourRef={{ tour3, tour4, tour5 }}>
            <div className={styles.page_container}>
                <div className={styles.new_survey_container}>
                    <label>{t("survey_create")}</label>
                    <div className={styles.card_container}>
                        <div className={styles.card} ref={tour1}>
                            <div
                                className={styles.image}
                                onClick={() => {
                                    setModal(true);
                                }}
                            >
                                <AddIcon />
                            </div>
                            <span>{t("survey_create_mini")}</span>
                        </div>
                        <div className={styles.card} ref={tour2}>
                            <Link href="/store">
                                <a>
                                    <div className={styles.image + " " + styles.more}>
                                        <NextIcon />
                                        <span>{t("survey_explore")}</span>
                                    </div>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>

                {!isLoading && !recentList.length ? (
                    <div className={styles.not_found}>
                        <label>{t("survey_newest")}</label>
                        <NotFoundIcon />
                        <span>{t("survey_empty_title")}</span>
                        <p>{t("survey_empty_label")}</p>
                    </div>
                ) : (
                    <Slider
                        title={t("survey_newest")}
                        list={recentList}
                        card={(survey) => {
                            return (
                                <Card
                                    survey={survey}
                                    style={{ minWidth: "16rem", maxWidth: "16rem" }}
                                    href={!isLoading && "/edit-survey/" + survey._id}
                                    key={survey._id}
                                />
                            );
                        }}
                        moreLink={() => {
                            if (recentList.length >= 5)
                                return (
                                    <button style={{ marginLeft: "1rem", marginBottom: ".25rem" }}>
                                        <Link href={"/survey-list"}>{t_c("view_more")}</Link>
                                    </button>
                                );
                        }}
                    />
                )}
            </div>
            <Modal />
            {/* {profile.level === "user" && (
                <Tour
                    position={getPosition(tourIndex)}
                    index={tourIndex}
                    setIndex={setTourIndex}
                    text={[
                        { title: t("tour_title_1"), body: t("tour_body_1") },
                        { title: t("tour_title_2"), body: t("tour_body_2") },
                        { title: t("tour_title_3"), body: t("tour_body_3") },
                        { title: t("tour_title_4"), body: t("tour_body_4") },
                        { title: t("tour_title_5"), body: t("tour_body_5") },
                        { title: t("tour_title_6"), body: t("tour_body_6") },
                    ]}
                />
            )} */}
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common", "home", "edit-survey"])),
        },
    };
};

export default auth(Home);
