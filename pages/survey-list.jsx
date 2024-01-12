import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { isMobile } from "detect-mobile-device";
import { auth } from "../utils/useAuth";
import styles from "./SurveyList.module.scss";

import { getCategory } from "../utils/functions";
import { useRecoilValue } from "recoil";
import { userProfile } from "../utils/recoil";
import { getAllSurvey } from "../utils/api/surveyApi";
import useModal from "../utils/useModal";

import { PageHeader as Header } from "../components/global/Header";
import Sidebar from "../components/wrapper/sidebar/Sidebar";
import Pagination from "../components/global/Pagination";
import TableList from "../components/global/TableList";
import SurveyCard from "../components/card/SurveyCard";
import TemplateCard from "../components/card/TemplateCard";
import Modal from "../components/home/Modal";
import Toolbar from "../components/global/Toolbar";

const SurveyList = () => {
    const [surveyList, setSurveyList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const { t } = useTranslation("home");
    const { t: t_c } = useTranslation("common");
    const { t: tooltip } = useTranslation("tooltip");

    const [mode, setMode] = useState("grid");
    console.log(setMode);

    const [param, setParam] = useState({ page: 1, query: "usergroup", search: "", sort: "newest", categoryId: "all", menu: "my_survey" });
    const { setModal } = useModal("new-survey");
    const router = useRouter();
    const categoryList = getCategory(router.locale);
    const profile = useRecoilValue(userProfile);
    const { level, userId } = profile;

    const groupList = [
        { label: t_c("all_group"), value: "all" },
        { label: t("survey_my_survey"), value: "my" },
        ...profile.groups?.map((group) => {
            return {
                label: group.groupName,
                value: group.groupId,
            };
        }),
    ];
    const menuList = [
        { label: t("survey_my_survey"), value: "my_survey" },
        { label: t("survey_my_library"), value: "my_library" },
        { label: t("survey_draft"), value: "draft" },
    ];
    const sortList = [
        { label: t_c("sort_newest"), value: "newest" },
        { label: t_c("sort_oldest"), value: "oldest" },
    ];

    const getData = (param) => {
        setParam(param);

        setLoading(true);
        getAllSurvey({ ...param, level, userId })
            .then((resolve) => {
                console.log(resolve);
                setSurveyList(param.menu === "my_library" ? resolve?.list : resolve?.lists);
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
        getData({ ...param, ...router.query });
    }, [router.query]);

    return (
        <Sidebar>
            <Header
                title="Survey"
                tooltip={tooltip("survey")}
                buttonList={
                    !isMobile() && [
                        {
                            label: "+ " + (router.locale === "en" ? t("survey_new") + " Survey" : "Survey " + t("survey_new")),
                            onClick: () => setModal(true),
                            style: { width: "8rem" },
                        },
                    ]
                }
            />

            <Toolbar
                render={["menu", "search", "dropdown"]}
                renderMobile={[["menu"], ["button", "filter"]]}
                searchBox={{
                    value: param.search,
                    onChange: (search) => {
                        const query = { ...param, page: 1, search };
                        if (!search) {
                            setParam({ ...param, search: "" });
                            delete query.search;
                        }

                        router.push({ pathname: "/survey-list", query }, undefined, { shallow: true });
                    },
                    placeholder: t("survey_search"),
                    label: t_c("filter_search"),
                }}
                menuList={{
                    value: param.menu,
                    onClick: (menu) => {
                        const query = { ...param, page: 1, menu };
                        if (!param.search) delete query.search;

                        router.push({ pathname: "/survey-list", query }, undefined, { shallow: true });
                    },
                    options: menuList,
                }}
                dropdownList={[
                    {
                        id: "dropdown-group",
                        value: param.groupId || "all",
                        onSelect: (groupId) => {
                            const type = groupId === "all" ? "usergroup" : groupId === "my" ? "createdBy" : "groupId";
                            const query = { ...param, page: 1, query: type, groupId };
                            if (!param.search) delete query.search;
                            if (["all", "my"].includes(groupId)) {
                                setParam({ ...param, search: "", groupId });
                                delete query.groupId;
                            }

                            router.push({ pathname: "/survey-list", query }, undefined, { shallow: true });
                        },
                        options: groupList,
                        label: t_c("filter_group"),
                    },
                    {
                        id: "dropdown-category",
                        value: param.categoryId || "all",
                        onSelect: (categoryId) => {
                            const query = { ...param, page: 1, categoryId };
                            if (!param.search) delete query.search;

                            router.push({ pathname: "/survey-list", query }, undefined, { shallow: true });
                        },
                        options: [{ label: t_c("all_category"), value: "all" }, ...categoryList],
                        label: t_c("filter_category"),
                    },
                    {
                        id: "dropdown-sort",
                        value: param.sort,
                        onSelect: (sort) => {
                            const query = { ...param, page: 1, sort };
                            if (!param.search) delete query.search;

                            router.push({ pathname: "/survey-list", query }, undefined, { shallow: true });
                        },
                        options: sortList,
                        label: t_c("filter_sort"),
                    },
                ]}
                buttonList={
                    isMobile() && [
                        {
                            label: "+ " + (router.locale === "en" ? t("survey_new") + " Survey" : "Survey " + t("survey_new")),
                            onClick: () => setModal(true),
                            style: { width: "8rem" },
                        },
                    ]
                }
            />
            {isLoading ? (
                <main className={styles.body}>
                    {Array.from({ length: 10 }, (_, index) => {
                        return <SurveyCard key={index} />;
                    })}
                </main>
            ) : (
                <>
                    {mode === "grid" ? (
                        <main className={styles.body}>
                            {surveyList.map((survey) => {
                                const href = param.menu === "my_library" ? "/detail-survey/" + survey._id : "/edit-survey/" + survey._id;
                                const Card = param.menu === "my_library" ? TemplateCard : SurveyCard;
                                return <Card survey={survey} key={survey._id} href={href} />;
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

                            router.push({ pathname: "/survey-list", query }, undefined, { shallow: true });
                        }}
                        row={10}
                    />
                </>
            )}
            <Modal text={t} text_common={t_c} />
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "home", "tooltip", "edit-survey"])),
    },
});

export default auth(SurveyList);
