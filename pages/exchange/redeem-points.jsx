import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { auth } from "../../utils/useAuth";
import { toast } from "react-toastify";
import styles from "./Exchange.module.scss";

import useModal from "../../utils/useModal";
import { getAllItemExchange } from "../../utils/api/voucherApi";

import { PageHeader as Header } from "../../components/global/Header";
import Sidebar from "../../components/wrapper/sidebar/Sidebar";
import Pagination from "../../components/global/Pagination";
import Card from "../../components/exchange/VoucherCard";
import Toolbar from "../../components/global/Toolbar";
import ModalBuy from "../../components/exchange/ModalBuy";

const Reedem = () => {
    const [voucherList, setVoucherList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [param, setParam] = useState({ page: 1, itemName: "", sort: "newest" });
    const { setData: setDataBuy } = useModal("buy-voucher");
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

    const getData = (param) => {
        setParam(param);

        setLoading(true);
        setVoucherList([]);
        getAllItemExchange({ ...param, status: "verified", isPublic: true })
            .then((resolve) => {
                console.log(resolve);
                setVoucherList(resolve?.lists);
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
            <Header title={t("title_redeem_points")} />
            <Toolbar
                render={["menu", "search", "dropdown"]}
                searchBox={{
                    value: param.itemName,
                    onChange: (itemName) => {
                        const query = { ...param, itemName };
                        if (!itemName) {
                            setParam({ ...param, itemName: "" });
                            delete query.itemName;
                        }

                        router.push({ pathname: "/exchange/redeem-points", query }, undefined, { shallow: true });
                    },
                }}
                menuList={{
                    value: "redeem-points",
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
                            if (!param.itemName) delete query.itemName;

                            router.push({ pathname: "/exchange/redeem-points", query }, undefined, { shallow: true });
                        },
                        options: sortList,
                    },
                ]}
            />
            {isLoading ? (
                <main className={styles.body}>
                    {Array.from({ length: 10 }, (_, index) => {
                        return <Card key={index} footer={<></>} />;
                    })}
                </main>
            ) : (
                <>
                    <main className={styles.body}>
                        {voucherList.map((voucher, index) => {
                            return (
                                <Card
                                    voucher={{ ...voucher, index }}
                                    key={voucher._id}
                                    onClick={() => setDataBuy(voucher)}
                                    style={{ minHeight: "16rem" }}
                                    footer={<></>}
                                />
                            );
                        })}
                    </main>
                    <Pagination
                        count={totalData}
                        page={param.page}
                        setPage={(page) => {
                            const query = { ...param, page };
                            if (!param.itemName) delete query.itemName;

                            router.push({ pathname: "/exchange/redeem-points", query }, undefined, { shallow: true });
                        }}
                        row={10}
                    />
                </>
            )}
            <ModalBuy text={t} text_common={t_c} />
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "exchange"])),
    },
});

export default auth(Reedem);
