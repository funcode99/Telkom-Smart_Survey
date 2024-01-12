import { useState } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { auth } from "../../utils/useAuth";

import Sidebar from "../../components/wrapper/sidebar/Sidebar";
import Toolbar from "../../components/global/Toolbar";
import { PageHeader as Header } from "../../components/global/Header";

const Reedem = () => {
    const [param, setParam] = useState({ search: "", sort: "newest" });
    const router = useRouter();
    const { t } = useTranslation("exchange");
    const { t: t_c } = useTranslation("common");

    const menuList = [
        { label: t("title_redeem"), value: "redeem-points" },
        { label: t("title_my_voucher"), value: "my-voucher" },
        { label: t("title_manage_voucher"), value: "create-voucher" },
    ];

    const sortList = [
        { label: t_c("sort_newest"), value: "newest" },
        { label: t_c("sort_oldest"), value: "oldest" },
    ];

    return (
        <Sidebar>
            <Header title={t("title_manage_voucher")} />
            <Toolbar
                render={["menu", "search", "dropdown"]}
                searchBox={{
                    value: param.search,
                    onChange: (search) => {
                        const query = { ...param, search };
                        if (!search) {
                            setParam({ ...param, search: "" });
                            delete query.search;
                        }

                        router.push({ pathname: "/exchange/my-voucher", query }, undefined, { shallow: true });
                    },
                }}
                menuList={{
                    value: "create-voucher",
                    options: menuList,
                    onClick: (menu) => {
                        router.push({ pathname: "/exchange/" + menu }, undefined, { shallow: true });
                    },
                }}
                dropdownList={[
                    {
                        value: param.sort,
                        onSelect: (sort) => {
                            const query = { ...param, sort };
                            if (!param.search) delete query.search;

                            router.push({ pathname: "/exchange/my-voucher", query }, undefined, { shallow: true });
                        },
                        options: sortList,
                    },
                ]}
            />
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "exchange"])),
    },
});

export default auth(Reedem);
