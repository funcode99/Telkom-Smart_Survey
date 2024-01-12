import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { auth } from "../utils/useAuth";
import { useRecoilValue } from "recoil";
import { userProfile } from "../utils/recoil.js";
import { toast } from "react-toastify";
import { getTransactionHistory, getListBilling } from "../utils/api/voucherApi.js";

import Sidebar from "../components/wrapper/sidebar/Sidebar";
import TableList from "../components/global/TableList";
import Pagination from "../components/global/Pagination";
import Toolbar from "../components/global/Toolbar";
import { PageHeader as Header } from "../components/global/Header";

const History = () => {
    const [isLoading, setLoading] = useState(false);
    const [transactionList, setTransactionList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [param, setParam] = useState({ mode: "transaction", page: 1 });
    const profile = useRecoilValue(userProfile);
    const router = useRouter();

    const getData = (param) => {
        const getTransaction = param.mode === "transaction" ? getTransactionHistory : getListBilling;
        setParam(param);

        setLoading(true);
        setTransactionList([]);
        getTransaction({ page: param.page, userId: profile.userId, row: 10 })
            .then((resolve) => {
                console.log(resolve);
                setTransactionList(param.mode === "transaction" ? resolve?.list : resolve?.lists);
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
            <Header title="History" />
            <Toolbar
                render={["menu"]}
                menuList={{
                    value: param.mode,
                    onClick: (mode) => {
                        const query = { ...param, mode, page: 1 };
                        router.push({ pathname: "/history", query }, undefined, { shallow: true });
                    },
                    options: [
                        { label: "Transaction", value: "transaction" },
                        { label: "Topup", value: "topup" },
                    ],
                }}
            ></Toolbar>
            <TableList
                onClick={(data) => {
                    if (param.mode === "topup" && data.status === "pending")
                        router.push({ pathname: "/payment/" + data.billingId, query: { redirect: "/history?mode=topup&page=" + param.page } });
                }}
                list={transactionList}
                isLoading={isLoading}
                header={param.mode === "transaction" ? ["Date", "Activity", "Balance"] : ["Billing ID", "Item", "Date", "Status"]}
                body={transactionList.map((transaction) =>
                    param.mode === "transaction"
                        ? [
                              moment(transaction.createdAt).format("DD MMM, YYYY hh:mm"),
                              `${transaction.activity} (${transaction.symbol + transaction.price})`,
                              transaction.lastBalance,
                          ]
                        : [
                              transaction.billingId,
                              transaction.item?.itemName || transaction.pricing?.name,
                              moment(transaction.paymentDetail?.transaction_time || transaction.createdAt).format("DD MMM, YYYY hh:mm"),
                              transaction.status,
                          ]
                )}
                hide_action
            />

            <Pagination
                count={totalData}
                page={param.page}
                setPage={(page) => {
                    const query = { ...param, page };
                    router.push({ pathname: "/history", query }, undefined, { shallow: true });
                }}
                row={10}
            />
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default auth(History);
