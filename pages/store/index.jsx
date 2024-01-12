import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { auth } from "../../utils/useAuth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { useTranslation } from "next-i18next";
import styles from "./Store.module.scss";

import { getCategory } from "../../utils/functions";
import { getAllSurveyPublic } from "../../utils/api/surveyApi";

import Sidebar from "../../components/wrapper/sidebar/Sidebar";
import Card from "../../components/card/TemplateCard";
import Slider from "../../components/card/Slider";
import Toolbar from "../../components/global/Toolbar";
import { PageHeader as Header } from "../../components/global/Header";

const Home = () => {
    const [input, setInput] = useState({ sort: "popular", search: "", share: "all" });
    const { t: t_c } = useTranslation("common");
    const router = useRouter();
    const categoryList = getCategory(router.locale);

    const shareList = [
        { label: t_c("all"), value: "all" },
        { label: t_c("free"), value: "share" },
        { label: t_c("paid"), value: "sell" },
    ];

    return (
        <Sidebar>
            <Header title={t_c("store")} />
            <Toolbar
                render={["search", "dropdown"]}
                searchBox={{
                    value: input.search,
                    placeholder: "Cari Template kesukaanmu",
                    onChange: (value) => setInput({ ...input, search: value }),
                }}
                dropdownList={[
                    {
                        id: "store-share",
                        value: input.share,
                        onSelect: (value) => setInput({ ...input, share: value }),
                        options: shareList,
                    },
                    {
                        id: "store-sort",
                        value: input.sort,
                        onSelect: (value) => setInput({ ...input, sort: value }),
                        options: [{ label: t_c("sort_popular"), value: "popular" }],
                    },
                ]}
            />
            <div className={styles.body} key={input.share}>
                {categoryList.map((category) => {
                    return (
                        <LazyLoadComponent key={category.value}>
                            <Slider
                                title={category.label}
                                card={(survey) => {
                                    return <Card survey={survey} key={survey._id} href={"/detail-survey/" + survey._id} style={{ width: "16rem" }} />;
                                }}
                                moreLink={(list) => {
                                    if (list.length >= 5)
                                        return (
                                            <button>
                                                <Link href={`/store/detail?categoryId=${category.value}`}>{t_c("view_more")}</Link>
                                            </button>
                                        );
                                }}
                                getData={() =>
                                    getAllSurveyPublic({ categoryId: category.value, share: input.share, query: null, disableCancel: true })
                                }
                            />
                        </LazyLoadComponent>
                    );
                })}
            </div>
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "store"])),
    },
});

export default auth(Home);
