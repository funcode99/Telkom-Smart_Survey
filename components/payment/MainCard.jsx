import PropTypes from "prop-types";
import Image from "next/image";
import styles from "./Card.module.scss";

import { MdOutlineArrowForwardIos } from "react-icons/md";
import MainLogo from "../../public/images/topup/main_logo.svg";
import WalletIcon from "../../public/images/topup/wallet.png";

const MainCard = ({ setMenu }) => {
    return (
        <div className={styles.container}>
            <MainLogo />
            <div className={styles.title}>
                <h5>Pilih Metode Pembayaran</h5>
            </div>
            <div className={styles.card_container}>
                <div className={styles.card} onClick={() => setMenu("bank-tranfer")}>
                    <Image alt="wallet-icon" src={WalletIcon.src} width={32} height={32} />
                    <div className={styles.body}>
                        <label>ATM/Bank Transfer</label>
                        <span>Bayar menggunakan ATM Bersama, Prima or Alto</span>
                    </div>
                    <MdOutlineArrowForwardIos />
                </div>
                <div className={styles.card} onClick={() => setMenu("e-wallet")}>
                    <Image alt="wallet-icon" src={WalletIcon.src} width={32} height={32} />
                    <div className={styles.body}>
                        <label>GoPay/OVO/E-Wallets lainnya</label>
                        <span>Scan QR code dengan GoPay/OVO/E-wallets lain</span>
                    </div>
                    <MdOutlineArrowForwardIos />
                </div>
                {/* <div className={styles.card}>
                    <Image alt="wallet-icon" src={WalletIcon.src} width={32} height={32} />
                    <div className={styles.body} onClick={() => setMenu("debit-credit")}>
                        <label>Debit/Credit Card</label>
                        <span>Bayar menggunakan Visa/ Master Card</span>
                    </div>
                    <MdOutlineArrowForwardIos />
                </div> */}
            </div>
        </div>
    );
};

MainCard.propTypes = {
    setMenu: PropTypes.func,
};

export default MainCard;
