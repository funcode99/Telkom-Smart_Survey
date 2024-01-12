import { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import styles from "./Feedback.module.scss";

import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { auth } from "../utils/useAuth.js";
import { getAllFeedback } from "../utils/api/feedbackApi.js";

import Sidebar from "../components/wrapper/sidebar/Sidebar";
import TableList from "../components/global/TableList";
import Pagination from "../components/global/Pagination";

const Feedback = () => {
    const [isLoading, setLoading] = useState(false);
    const [feedbackList, setFeedbackList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [param, setParam] = useState({ page: 1 });

    const getData = () => {
        setLoading(true);
        getAllFeedback(param)
            .then((resolve) => {
                console.log(resolve);
                setFeedbackList(resolve?.list);
                setTotalData(resolve?.totalData);
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
        getData(param);
    }, [param]);

    return (
        <Sidebar>
            <h3 className={styles.title}>Feedback</h3>
            <TableList
                list={feedbackList}
                isLoading={isLoading}
                header={["Email", "Rating", "Name", "Message"]}
                body={feedbackList.map((feedback) => {
                    return [
                        {
                            value: feedback.email,
                            style: { fontWeight: "bold", color: "#191A1A" },
                        },
                        {
                            value: (
                                <>
                                    {Array.from({ length: 5 }, (_, index) => {
                                        if (index <= feedback.rating) {
                                            return <AiFillStar className={styles.star} />;
                                        } else {
                                            return <AiOutlineStar className={styles.star} />;
                                        }
                                    })}
                                </>
                            ),
                        },
                        feedback.name,
                        feedback.message,
                    ];
                })}
                hide_action
            />
            <Pagination count={totalData} row={20} page={param.page} setPage={(page) => setParam({ ...param, page })} />
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default auth(Feedback);
