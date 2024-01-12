import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import moment from "moment";
import { useTranslation } from "next-i18next";
import styles from "./VoucherList.module.scss";
import "moment/locale/id";

import useModal from "../../utils/useModal";
import { getAllVoucher } from "../../utils/api/voucherApi";

import Pagination from "../../components/global/Pagination";
import Card from "../../components/exchange/VoucherCard";

const VoucherList = ({ title, param, setParam, isUsed, refresh }) => {
    const [voucherList, setVoucherList] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const { setData: setDataUse } = useModal("use-voucher");
    const router = useRouter();
    const { t } = useTranslation("exchange");

    useEffect(() => {
        moment.locale(router.locale);
    }, []);

    const getData = (param) => {
        if (!isUsed) setParam(param);

        setLoading(true);
        setVoucherList([]);
        getAllVoucher({ param, page, isReedemed: isUsed ? true : false })
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
    }, [router.query, page, refresh]);

    return (
        <div className={styles.container}>
            <h5>{title}</h5>
            {isLoading ? (
                <div className={styles.card_container}>
                    {Array.from({ length: 10 }, (_, index) => {
                        return <Card key={index} />;
                    })}
                </div>
            ) : !voucherList.length ? (
                <div>Voucher kamu kosong!</div>
            ) : (
                <>
                    <div className={styles.card_container + (isUsed ? " " + styles.grayscale : "")}>
                        {voucherList.map((voucher, index) => {
                            console.log(voucher);
                            return (
                                <Card
                                    voucher={{ index, ...voucher, ...voucher.item, qty: null }}
                                    key={voucher._id}
                                    onClick={() => {
                                        if (!isUsed) setDataUse(voucher);
                                    }}
                                    style={{ cursor: isUsed && "default", minHeight: "16rem" }}
                                    header={
                                        <span className={styles.header}>
                                            {t("voucher_valid_until")} {moment(voucher.expiredDate).format("DD MMMM YYYY")}
                                        </span>
                                    }
                                    footer={<></>}
                                />
                            );
                        })}
                    </div>
                    <Pagination count={totalData} page={page} setPage={(page) => setPage(page)} row={10} />
                </>
            )}
        </div>
    );
};

VoucherList.propTypes = {
    title: PropTypes.string,
    param: PropTypes.object,
    setParam: PropTypes.func,
    isUsed: PropTypes.bool,
    refresh: PropTypes.number,
};

export default VoucherList;
