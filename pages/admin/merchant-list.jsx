import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { auth } from "../../utils/useAuth";
import { toast } from "react-toastify";
import moment from "moment";
import styles from "./List.module.scss";

import useModal from "../../utils/useModal";
import { getAllMerchant } from "../../utils/api/merchantApi";

import { PageHeader as Header } from "../../components/global/Header";
import Sidebar from "../../components/wrapper/sidebar/Sidebar";
import Pagination from "../../components/global/Pagination";
import TableList from "../../components/global/TableList";
import Toolbar from "../../components/global/Toolbar";
import ModalMerchantVerify from "../../components/merchant/ModalMerchantVerify";

const menuList = [
    { label: "Verified", value: "approved" },
    { label: "Pending", value: "pending" },
    { label: "Reject", value: "rejected" },
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

const MerchantList = () => {
    const [merchantList, setMerchantList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [param, setParam] = useState({ page: 1, search: "", sort: "newest", status: "approved" });
    const { setData } = useModal("verify-merchant");
    const router = useRouter();

    const getData = (param) => {
        setParam(param);

        setLoading(true);
        setMerchantList([]);
        getAllMerchant(param)
            .then((resolve) => {
                console.log(resolve);
                setMerchantList(resolve?.lists);
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
            <Script
                id="google-maps"
                type="text/javascript"
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&region=ID&language=id&libraries=places,geometry`}
                strategy="afterInteractive"
            />
            <Header title="Merchant List" />
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

                        router.push({ pathname: "/admin/merchant-list", query }, undefined, { shallow: true });
                    },
                }}
                menuList={{
                    value: param.status,
                    onClick: (status) => {
                        const query = { ...param, page: 1, status };
                        if (!param.search) delete query.search;

                        router.push({ pathname: "/admin/merchant-list", query }, undefined, { shallow: true });
                    },
                    options: menuList,
                }}
                dropdownList={[
                    {
                        value: param.sort,
                        onSelect: (sort) => {
                            const query = { ...param, page: 1, sort };
                            if (!param.search) delete query.search;

                            router.push({ pathname: "/admin/merchant-list", query }, undefined, { shallow: true });
                        },
                        options: sortList,
                    },
                ]}
            />
            <TableList
                onClick={(merchant) => {
                    if (merchant.status === "pending") {
                        setData(merchant);
                    }
                }}
                list={merchantList}
                isLoading={isLoading}
                header={["Name", "Address", "Request Date", "Status"]}
                body={merchantList.map((merchant) => {
                    return [
                        merchant.name,
                        merchant.address[0]?.text,
                        moment(merchant.createdAt).format("DD MMM, YYYY hh:mm"),
                        {
                            value: (
                                <span style={color[merchant.status]} className={styles.status}>
                                    {merchant.status}
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

                    router.push({ pathname: "/admin/merchant-list", query }, undefined, { shallow: true });
                }}
                row={10}
            />
            <ModalMerchantVerify refresh={() => getData(param)} />
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "exchange", "merchant"])),
    },
});

export default auth(MerchantList, ["super", "admin"]);
