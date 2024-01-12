import { useState, useEffect } from "react";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import moment from "moment";
import styles from "./Statistic.module.scss";

import { auth } from "../../utils/useAuth";
import { getAllUser } from "../../utils/api/userApi.js";
import { getActivity } from "../../utils/api/activityApi";
import UserIcon from "../../public/images/user/user_icon.png";
import CalendarIcon from "../../public/images/user/calendar_icon.png";

import Sidebar from "../../components/wrapper/sidebar/Sidebar";
import TableList from "../../components/global/TableList";
import Toolbar from "../../components/global/Toolbar";
import Pagination from "../../components/global/Pagination";
import Modal from "../../components/user/Modal";
import InfoCard from "../../components/user/InfoCard";

const Statistic = () => {
    const [isLoading, setLoading] = useState(false);
    const [isActivityLoading, setActivityLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    const [totalData, setTotalData] = useState(0);

    const [registeredUser, setRegisteredUser] = useState(null);
    const [activeList, setActiveList] = useState([]);
    const [activeUser, setActiveUser] = useState(null);

    const [param, setParam] = useState({ status: "verified", page: 1 });
    const [menu, setMenu] = useState("all_user");

    const getData = (param, menu) => {
        setParam(param);
        if (menu) setMenu(menu);

        setLoading(true);
        getAllUser({ ...param, level: "user" })
            .then((resolve) => {
                setUserList(resolve?.lists);
                setTotalData(resolve?.totalCount);

                if (param.status === "verified") setRegisteredUser(resolve?.totalCount);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getActiveUser = () => {
        const params = {
            aggs: {
                group_by_name: {
                    terms: {
                        field: "userId.keyword",
                        size: 10000,
                    },
                    aggs: {
                        metadata: {
                            top_hits: {
                                size: 1,
                                sort: [
                                    {
                                        "@timestamp": {
                                            order: "desc",
                                        },
                                    },
                                ],
                                _source: {
                                    include: ["fullname", "email", "mobile", "@timestamp"],
                                },
                            },
                        },
                    },
                },
            },
            query: {
                bool: {
                    must: [
                        {
                            range: {
                                "@timestamp": {
                                    gte: moment().startOf("month").format("YYYY-MM-DD"),
                                    lte: moment().endOf("month").format("YYYY-MM-DD"),
                                },
                            },
                        },
                    ],
                },
            },
            size: 0,
        };

        setActivityLoading(true);
        getActivity({ event: "login", params: JSON.stringify(params) })
            .then((resolve) => {
                console.log(resolve);
                setActiveList(
                    resolve.group_by_name?.buckets?.map((user) => ({
                        userId: user.key,
                        doc_count: user.doc_count,
                        ...user?.metadata?.hits?.hits?.[0]?._source,
                    }))
                );
                setActiveUser(resolve.group_by_name?.buckets?.length);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => setActivityLoading(false));
    };

    useEffect(() => {
        getData(param);
        getActiveUser();
    }, []);

    return (
        <Sidebar>
            <div className={styles.header}>
                <h3>Statistic</h3>
                <div className={styles.card_container}>
                    <InfoCard
                        icon={<Image src={UserIcon.src} alt="icon" width={70} height={70} />}
                        label="Registered User"
                        value={registeredUser}
                        redirect="/statistic/user?registered"
                    />
                    <InfoCard
                        icon={<Image src={CalendarIcon.src} alt="icon" width={91} height={70} />}
                        label="Monthly Active User"
                        value={activeUser}
                        redirect="/statistic/user?active"
                    />
                </div>
            </div>
            <Toolbar
                activeMenu={menu}
                containerStyle={{ marginBottom: ".5rem" }}
                menuStyle={{ width: "320px" }}
                menuList={[
                    {
                        label: "All User",
                        value: "all_user",
                        onClick: () => setMenu("all_user"),
                    },
                    {
                        label: "Monthly active user",
                        value: "active_user",
                        onClick: () => setMenu("active_user"),
                    },
                ]}
            />
            {menu === "all_user" ? (
                <TableList
                    list={userList}
                    isLoading={isLoading}
                    header={["Name", "Email", "Mobile", "Survey", "Quiz"]}
                    body={userList.map((user) => {
                        return [
                            { value: user.fullname, style: { fontWeight: "bold" } },
                            user.email,
                            user.mobile,
                            { value: user.totalSurvey || "0", style: { color: "#7B6EE3" } },
                            { value: user.totalQuiz || "0", style: { color: "#7B6EE3" } },
                        ];
                    })}
                    hide_action
                />
            ) : (
                <TableList
                    containerStyle={{ marginBottom: "32px" }}
                    list={activeList}
                    isLoading={isActivityLoading}
                    header={["Name", "Email", "Monthly Access", "Last Access"]}
                    body={activeList.map((user) => {
                        return [
                            { value: user.fullname, style: { fontWeight: "bold" } },
                            user.email,
                            user.doc_count,
                            moment(user["@timestamp"]).format("DD/MM/YYYY, HH:mm"),
                        ];
                    })}
                    hide_action
                />
            )}
            {menu === "all_user" && <Pagination count={totalData} page={param.page} setPage={(page) => getData({ ...param, page })} />}
            <Modal />
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default auth(Statistic);
