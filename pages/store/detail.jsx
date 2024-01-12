import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import styles from "./Detail.module.scss";

import { getCategory } from "../../utils/functions";
import { auth } from "../../utils/useAuth";
import { BiDownload } from "react-icons/bi";
import { getAllSurveyPublic } from "../../utils/api/surveyApi";

import Sidebar from "../../components/wrapper/sidebar/Sidebar";
import Pagination from "../../components/global/Pagination";
import Spinner from "../../components/global/Spinner";
import Card from "../../components/card/TemplateCard";
import Toolbar from "../../components/global/Toolbar";
import { PageHeader as Header } from "../../components/global/Header";

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

    const [param, setParam] = useState({ page: 1, search: "", sort: "newest", categoryId: "all", share: "all" });

    const router = useRouter();
    const categoryList = getCategory(router.locale);
    const { t: t_c } = useTranslation("common");

    const shareList = [
        { label: t_c("all"), value: "all" },
        { label: t_c("free"), value: "share" },
        { label: t_c("paid"), value: "sell" },
    ];

    const sortList = [
        { label: t_c("sort_newest"), value: "newest" },
        { label: t_c("sort_oldest"), value: "oldest" },
    ];

    const getData = (param) => {
        setParam(param);

        setLoading(true);
        getAllSurveyPublic({ ...param, row: 10 })
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
        <Sidebar>
            <Header title={t_c("store")} />
            <Toolbar
                render={["search", "dropdown"]}
                searchBox={{
                    value: param.search,
                    onChange: (search) => {
                        const query = { ...param, page: 1, search };
                        if (!search) delete query.search;

                        router.push({ pathname: "/store/detail", query }, undefined, { shallow: true });
                    },
                }}
                dropdownList={[
                    {
                        id: "store-share",
                        value: param.share,
                        onSelect: (share) => {
                            const query = { ...param, page: 1, share };
                            if (!param.search) delete query.search;
                            router.push({ pathname: "/store/detail", query }, undefined, { shallow: true });
                        },
                        options: shareList,
                    },
                    {
                        id: "store-sort",
                        value: param.sort,
                        onSelect: (sort) => {
                            const query = { ...param, page: 1, sort };
                            if (!param.search) delete query.search;

                            router.push({ pathname: "/store/detail", query }, undefined, { shallow: true });
                        },
                        options: sortList,
                    },
                    {
                        id: "store-category",
                        value: param.categoryId,
                        onSelect: (categoryId) => {
                            const query = { ...param, page: 1, categoryId };
                            if (!param.search) delete query.search;

                            router.push({ pathname: "/store/detail", query }, undefined, { shallow: true });
                        },
                        options: [{ label: "All Categories", value: "all" }, ...categoryList],
                    },
                ]}
            />
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <main className={styles.body}>
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
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "store"])),
    },
});

export default auth(StoreDetail);
