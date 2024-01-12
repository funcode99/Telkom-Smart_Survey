import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { toast } from "react-toastify";
import styles from "./Method.module.scss";
import "moment/locale/id";

import { FaRegCopy } from "react-icons/fa";
import MainLogo from "../../../public/images/topup/main_logo.svg";
import { convertRupiah } from "../../../utils/functions";

const bankName = (bank) => {
    switch (bank) {
        case "bni":
            return "BNI";
        case "bri":
            return "BRI";
        case "mandiri":
            return "Mandiri";
        case "permata":
            return "Permata";
        default:
            return "";
    }
};

const VirtualAccount = ({ data }) => {
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setCountdown(countdown + 1);
        }, 1000);
    }, [countdown]);

    const setDate = (number) => {
        const hours = Math.floor((number % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((number % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((number % (1000 * 60)) / 1000);
        const total = hours * 3600 + minutes * 60 + seconds;
        return moment.utc(total * 1000).format("HH:mm:ss");
    };

    return (
        <div className={styles.container + " " + styles.virtual_account}>
            <MainLogo />
            <h5 className={styles.title}>Detail Pembayaran</h5>
            <div className={styles.timer_container}>
                <span>Selesaikan pembayaran dalam waktu</span>
                <label className={styles.time}>
                    {setDate(new Date(moment(moment(data.transaction_time).add(1, "days"))).getTime() - new Date().getTime())}
                </label>
                <span>Batas Akhir Pembayaran</span>
                <label className={styles.date}>{moment(data.transaction_time).add(1, "days").format("dddd, D MMMM YYYY | HH:mm")}</label>
            </div>
            <div className={styles.number_container}>
                <div className={styles.bank_name}>
                    <span>Bank</span>
                    <label>{bankName(data.va_numbers?.[0]?.bank)} Virtual Account</label>
                    <div className={styles.va_number}>
                        <span>{data.va_numbers?.[0]?.va_number}</span>
                        <FaRegCopy
                            onClick={() => {
                                if (typeof navigator !== "undefined") {
                                    navigator.clipboard.writeText(data.va_numbers?.[0]?.va_number);
                                    toast.info("Copied to clipboard");
                                }
                            }}
                        />
                    </div>
                </div>
                <div className={styles.total_payment}>
                    <span>Total Pembayaran</span>
                    <label>{convertRupiah(parseFloat(data.gross_amount), { initial: "Rp", separator: "." })}</label>
                </div>
            </div>
            {/* <div className={styles.payment_guide}>
                <span className={styles.payment_title}>Cara Pembayaran</span>
                <div className={styles.split}>
                    <span>Mandiri Virtual Account</span>
                </div>
                <div className={styles.card_container}>
                    <div className={styles.card}>ATM Mandiri</div>
                    <div className={styles.separator} />
                    <div className={styles.card}>ATM Mandiri</div>
                    <div className={styles.separator} />
                    <div className={styles.card}>ATM Mandiri</div>
                </div>
            </div> */}
        </div>
    );
};

VirtualAccount.propTypes = {
    data: PropTypes.object,
};

export default VirtualAccount;
