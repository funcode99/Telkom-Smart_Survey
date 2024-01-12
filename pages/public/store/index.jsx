import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { useTranslation } from "next-i18next";
import styles from "./Store.module.scss";

import { authReverse } from "../../../utils/useAuth";
import { getCategory } from "../../../utils/functions";
import { BiDownload } from "react-icons/bi";
import { getAllSurveyPublic } from "../../../utils/api/surveyApi";

import Card from "../../../components/card/SurveyCard";
import Slider from "../../../components/card/Slider";
import Toolbar from "../../../components/global/Toolbar";
import { PageHeader as Header } from "../../../components/global/Header";

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

const Store = () => {
    const [input, setInput] = useState({ sort: "popular", search: "" });
    const { t: t_c } = useTranslation("common");
    const router = useRouter();
    const categoryList = getCategory(router.locale);

    return (
        <div className={styles.container}>
            <Header title={t_c("store")} />
            <main className={styles.body}>
                <div className={styles.title}>
                    <h2>Want to see our sample Survey?</h2>
                    <p>Please have a look at our sample surveys</p>
                </div>
                <Toolbar
                    render={["search", "dropdown"]}
                    searchBox={{
                        value: input.search,
                        onChange: (value) => setInput({ ...input, search: value }),
                    }}
                    dropdownList={[
                        {
                            value: input.sort,
                            onSelect: (value) => setInput({ ...input, sort: value }),
                            options: [{ label: "Most popular", value: "popular" }],
                        },
                    ]}
                />
                <div className={styles.content}>
                    {categoryList.map((category) => {
                        return (
                            <LazyLoadComponent key={category.value}>
                                <Slider
                                    title={category.label}
                                    card={(survey) => {
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
                                                style={{ width: "16rem" }}
                                            />
                                        );
                                    }}
                                    moreLink={(list) => {
                                        if (list.length >= 10)
                                            return (
                                                <button>
                                                    <Link href={`/public/store/detail?categoryId=${category.value}`}>{t_c("view_more")}</Link>
                                                </button>
                                            );
                                    }}
                                    getData={() => getAllSurveyPublic({ share: "all", categoryId: category.value, disableCancel: true })}
                                />
                            </LazyLoadComponent>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default authReverse(Store, "/store");
