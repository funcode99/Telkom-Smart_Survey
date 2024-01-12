import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { auth } from "../../utils/useAuth";
import { toast } from "react-toastify";
import moment from "moment";
import styles from "./List.module.scss";

import { getAllWithdraw } from "../../utils/api/withdrawApi";

import { PageHeader as Header } from "../../components/global/Header";
import Sidebar from "../../components/wrapper/sidebar/Sidebar";
import Pagination from "../../components/global/Pagination";
import TableList from "../../components/global/TableList";
import Toolbar from "../../components/global/Toolbar";
import ModalApproval from "../../components/withdraw/ModalApproval";

const menuList = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
];

const sortList = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
];

const color = {
    approved: {
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

const WithdrawList = () => {
    const [withdrawList, setWithdrawList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [param, setParam] = useState({ page: 1, search: "", sort: "newest", status: "pending" });
    const router = useRouter();
    const { t: t_c } = useTranslation("common");

    const getData = (param) => {
        setParam(param);

        setLoading(true);
        setWithdrawList([]);
        getAllWithdraw(param)
            .then((resolve) => {
                console.log(resolve);
                setWithdrawList(resolve?.lists);
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
            <Header title="Withdraw List" />
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

                        router.push({ pathname: "/admin/withdraw-list", query }, undefined, { shallow: true });
                    },
                }}
                menuList={{
                    value: param.status,
                    onClick: (status) => {
                        const query = { ...param, page: 1, status };
                        if (!param.search) delete query.search;

                        router.push({ pathname: "/admin/withdraw-list", query }, undefined, { shallow: true });
                    },
                    options: menuList,
                }}
                dropdownList={[
                    {
                        value: param.sort,
                        onSelect: (sort) => {
                            const query = { ...param, page: 1, sort };
                            if (!param.search) delete query.search;

                            router.push({ pathname: "/admin/withdraw-list", query }, undefined, { shallow: true });
                        },
                        options: sortList,
                    },
                ]}
            />
            <TableList
                modalIdentifier={param.status === "pending" && "withdraw-approval"}
                list={withdrawList}
                isLoading={isLoading}
                header={["Withdraw ID", "Email", "Point", "Bank", "Account Number", "Date", "Status"]}
                body={withdrawList.map((withdraw) => {
                    return [
                        withdraw.withdrawalId,
                        withdraw.user?.email,
                        withdraw.point,
                        withdraw.bank,
                        withdraw.accountNumber,
                        moment(withdraw.createdAt).format("DD MMM, YYYY hh:mm"),
                        {
                            value: (
                                <span style={color[withdraw.status]} className={styles.status}>
                                    {withdraw.status}
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

                    router.push({ pathname: "/admin/withdraw-list", query }, undefined, { shallow: true });
                }}
                row={10}
            />
            <ModalApproval text_common={t_c} refresh={() => getData(param)} />
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "exchange"])),
    },
});

export default auth(WithdrawList, ["super"]);
