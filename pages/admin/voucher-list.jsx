import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { auth } from "../../utils/useAuth";
import { toast } from "react-toastify";
import moment from "moment";
import styles from "./List.module.scss";

import useModal from "../../utils/useModal";
import { getAllItemExchange } from "../../utils/api/voucherApi";

import { PageHeader as Header } from "../../components/global/Header";
import Sidebar from "../../components/wrapper/sidebar/Sidebar";
import Pagination from "../../components/global/Pagination";
import TableList from "../../components/global/TableList";
import Toolbar from "../../components/global/Toolbar";
import ModalAdd from "../../components/exchange/ModalAdd";
import ModalEdit from "../../components/exchange/ModalEdit";
import ModalVerify from "../../components/exchange/ModalVerify";

const menuList = [
    { label: "Verified", value: "verified" },
    { label: "Pending", value: "pending" },
    { label: "Reject", value: "reject" },
];

const sortList = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
];

const color = {
    verified: {
        background: "#DFFFF0",
        color: "#0EB37E",
    },
    pending: {
        background: "#FFF0E2",
        color: "#FF7E00",
    },
    reject: {
        background: "#FFE2E2",
        color: "#DA0000",
    },
};

const VoucherList = () => {
    const [voucherList, setVoucherList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [param, setParam] = useState({ page: 1, search: "", sort: "newest", status: "verified" });
    const { setModal: setModalAdd } = useModal("add-voucher");
    const { setData: setModalEdit } = useModal("edit-voucher");
    const { setData: setModalVerify } = useModal("verify-voucher");
    const router = useRouter();
    const { t } = useTranslation("exchange");
    const { t: t_c } = useTranslation("common");

    const getData = (param) => {
        setParam(param);

        setLoading(true);
        setVoucherList([]);
        getAllItemExchange({ ...param, isAvailable: null, isExpired: null })
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
            <Header title="Voucher List" />
            <Toolbar
                render={["menu", "search", "dropdown"]}
                searchBox={{
                    value: param.search,
                    onChange: (search) => {
                        const query = { ...param, page: 1, search };
                        if (!search) {
                            setParam({ ...param, search: "" });
                            delete query.search;
                        }

                        router.push({ pathname: "/admin/voucher-list", query }, undefined, { shallow: true });
                    },
                }}
                menuList={{
                    value: param.status,
                    onClick: (status) => {
                        const query = { ...param, page: 1, status };
                        if (!param.search) delete query.search;

                        router.push({ pathname: "/admin/voucher-list", query }, undefined, { shallow: true });
                    },
                    options: menuList,
                }}
                dropdownList={[
                    {
                        value: param.sort,
                        onSelect: (sort) => {
                            const query = { ...param, page: 1, sort };
                            if (!param.search) delete query.search;

                            router.push({ pathname: "/admin/voucher-list", query }, undefined, { shallow: true });
                        },
                        options: sortList,
                    },
                ]}
                buttonList={[
                    {
                        label: "+ " + t("voucher_create"),
                        onClick: () => setModalAdd(true),
                    },
                ]}
            />
            <TableList
                onClick={(voucher) => {
                    console.log(voucher);
                    if (voucher.status === "verified") {
                        setModalEdit(voucher);
                    } else {
                        setModalVerify(voucher);
                    }
                }}
                list={voucherList}
                isLoading={isLoading}
                header={["Name", "Description", "Price", "Quantity", "Expired Date", "Created Date", "Status"]}
                body={voucherList.map((voucher) => {
                    return [
                        voucher.itemName,
                        voucher.desc,
                        voucher.price,
                        voucher.qty,
                        moment(voucher.expDate).format("DD MMM YYYY hh:mm"),
                        moment(voucher.createdAt).format("DD MMM, YYYY hh:mm"),
                        {
                            value: (
                                <span style={color[voucher.status]} className={styles.status}>
                                    {voucher.status}
                                </span>
                            ),
                        },
                    ];
                })}
                hide_action
            />
            <Pagination
                count={totalData}
                page={param.page}
                setPage={(page) => {
                    const query = { ...param, page };
                    if (!param.search) delete query.search;

                    router.push({ pathname: "/admin/voucher-list", query }, undefined, { shallow: true });
                }}
                row={10}
            />

            <ModalAdd text={t} text_common={t_c} refresh={() => getData({ page: 1, status: "pending" })} />
            <ModalEdit text={t} text_common={t_c} refresh={() => getData(param)} />
            <ModalVerify text={t} text_common={t_c} refresh={() => getData(param)} />
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "exchange"])),
    },
});

export default auth(VoucherList, ["super", "admin", "user"]);
