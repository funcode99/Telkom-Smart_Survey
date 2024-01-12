import PropTypes from "prop-types";
import Image from "next/image";
import styles from "./Card.module.scss";

import { MdArrowBack, MdOutlineArrowForwardIos } from "react-icons/md";
import MainLogo from "../../public/images/topup/main_logo.svg";
import WalletIcon from "../../public/images/topup/wallet.png";

const DebitCard = ({ setMenu }) => {
    return (
        <div className={styles.container}>
            <MainLogo />
            <div className={styles.title} onClick={() => setMenu("main")}>
                <MdArrowBack />
                <h5>Debit/Credit Card</h5>
            </div>
            <div className={styles.card_container}>
                <div className={styles.card}>
                    <Image alt="wallet-icon" src={WalletIcon.src} width={32} height={32} />
                    <div className={styles.body}>
                        <label>BCA Debit</label>
                    </div>
                    <MdOutlineArrowForwardIos />
                </div>
            </div>
        </div>
    );
};

DebitCard.propTypes = {
    setMenu: PropTypes.func,
};

export default DebitCard;
