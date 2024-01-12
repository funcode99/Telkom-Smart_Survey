import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Image from "next/image";
import styles from "./Method.module.scss";
import "moment/locale/id";

import GopayIcon from "../../../public/images/topup/gopay.png";
import { convertRupiah } from "../../../utils/functions";

const Gopay = ({ data }) => {
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
            <h5 className={styles.title}>Detail Pembayaran</h5>
            <span className={styles.title_gopay}>
                Buka aplikasi gojek anda dan
                <br />
                scan QR code di bawah ini
            </span>
            <Image src={data?.actions?.[0]?.url} width={300} height={300} alt="gopay" />
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
                    <span>Metode</span>
                    <div className={styles.brand_icon}>
                        <Image src={GopayIcon.src} alt="gopay" width={62} height={20} />
                    </div>
                </div>
                <div className={styles.total_payment}>
                    <span>Total Pembayaran</span>
                    <label>{convertRupiah(parseFloat(data.gross_amount), { initial: "Rp", separator: "." })}</label>
                </div>
            </div>
        </div>
    );
};

Gopay.propTypes = {
    data: PropTypes.object,
};

export default Gopay;
