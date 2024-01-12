import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import styles from "./Detail.module.scss";

import { getCategory } from "../../../utils/functions";
import { authReverse } from "../../../utils/useAuth";
import { BiDownload } from "react-icons/bi";
import { getAllSurveyPublic } from "../../../utils/api/surveyApi";

import Pagination from "../../../components/global/Pagination";
import TableList from "../../../components/global/TableList";
import Spinner from "../../../components/global/Spinner";
import Card from "../../../components/card/SurveyCard";
import Toolbar from "../../../components/global/Toolbar";
import { PageHeader as Header } from "../../../components/global/Header";

const sortList = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
];

const background = {
    sell: {
        color: "#FF7E00",
        background: "#FFF7EC",
    },
    share: {
        color: "#A980F8",
        background: "#F1F0FF",
    },
};

const StoreDetail = () => {
    const [surveyList, setSurveyList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [isLoading, setLoading] = useState(false);

    const [mode, setMode] = useState("grid");
    console.log(setMode);

    const [param, setParam] = useState({ page: 1, search: "", sort: "newest", categoryId: "all" });

    const router = useRouter();
    const categoryList = getCategory(router.locale);
    const { t: t_c } = useTranslation("common");

    const getData = (param) => {
        setParam(param);

        setLoading(true);
        getAllSurveyPublic({ ...param, row: 12, share: "all" })
            .then((resolve) => {
                console.log(resolve);
                setSurveyList(resolve?.lists);
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
        console.log(router.query);
        getData({ ...param, ...router.query });
    }, [router.query]);

    return (
        <div className={styles.container}>
            <Header title={t_c("store")} />
            <div className={styles.body}>
                <div className={styles.title}>
                    <h2>Want to see our sample Survey?</h2>
                    <p>Please have a look at our sample surveys</p>
                </div>
                <Toolbar
                    render={["search", "dropdown"]}
                    searchBox={{
                        value: param.search,
                        onChange: (search) => {
                            const query = { ...param, page: 1, search };
                            if (!search) delete query.search;

                            router.push({ pathname: "/public/store/detail", query }, undefined, { shallow: true });
                        },
                    }}
                    dropdownList={[
                        {
                            value: param.sort,
                            onSelect: (sort) => {
                                const query = { ...param, page: 1, sort };
                                if (!param.search) delete query.search;

                                router.push({ pathname: "/public/store/detail", query }, undefined, { shallow: true });
                            },
                            options: sortList,
                        },
                        {
                            value: param.categoryId,
                            onSelect: (categoryId) => {
                                const query = { ...param, page: 1, categoryId };
                                if (!param.search) delete query.search;

                                router.push({ pathname: "/public/store/detail", query }, undefined, { shallow: true });
                            },
                            options: [{ label: "All Categories", value: "all" }, ...categoryList],
                        },
                    ]}
                />
                {isLoading ? (
                    <Spinner />
                ) : (
                    <>
                        {mode === "grid" ? (
                            <main className={styles.content}>
                                {surveyList.map((survey) => {
                                    return (
                                        <Card
                                            survey={survey}
                                            key={survey._id}
                                            header={
                                                survey._id && (
                                                    <div className={styles.card_header}>
                                                        {survey.isSelling === "sell" && <label>Price: 100</label>}
                                                        <label style={background[survey.isSelling]}>
                                                            {survey.isSelling === "sell" ? "Paid" : "Free"} Template
                                                        </label>
                                                    </div>
                                                )
                                            }
                                            footer={
                                                <div className={styles.card_footer}>
                                                    <BiDownload />
                                                    <span>
                                                        <b>{survey.totalUsed}</b> Used
                                                    </span>
                                                </div>
                                            }
                                            href={"/detail-survey/" + survey._id}
                                        />
                                    );
                                })}
                            </main>
                        ) : (
                            <TableList
                                list={surveyList}
                                header={["Title", "Description", "Questions", "Results"]}
                                body={surveyList.map((survey) => [
                                    survey.title,
                                    survey.description,
                                    survey.totalQuestion || "0",
                                    survey.totalResult || "0",
                                ])}
                                onClick={(survey) => router.push("edit-survey/" + survey._id)}
                                hide_action
                            />
                        )}
                        <Pagination
                            count={totalData}
                            page={param.page}
                            setPage={(page) => {
                                const query = { ...param, page };
                                if (!param.search) delete query.search;

                                router.push({ pathname: "/store/detail", query }, undefined, { shallow: true });
                            }}
                            row={12}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default authReverse(StoreDetail, "/store");
