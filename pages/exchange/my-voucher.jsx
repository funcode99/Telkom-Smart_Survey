import { useState } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { auth } from "../../utils/useAuth";
import styles from "./Exchange.module.scss";

import Sidebar from "../../components/wrapper/sidebar/Sidebar";
import Toolbar from "../../components/global/Toolbar";
import { PageHeader as Header } from "../../components/global/Header";
import ModalUse from "../../components/exchange/ModalUse";
import VoucherList from "../../components/exchange/VoucherList";

const Reedem = () => {
    const [refresh, setRefresh] = useState(0);
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
            <Header title={t("title_my_voucher")} />
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
                    value: "my-voucher",
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

            <VoucherList title="Belum Digunakan" param={param} setParam={setParam} styles={styles} refresh={refresh} />
            <VoucherList title={"Sudah Digunakan & Tidak Berlaku"} param={param} setParam={setParam} styles={styles} refresh={refresh} isUsed />
            <ModalUse text={t} text_common={t_c} refresh={() => setRefresh(refresh + 1)} />
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "exchange"])),
    },
});

export default auth(Reedem);
