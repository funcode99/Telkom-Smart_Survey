import { useEffect } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import Link from "next/link";
import styles from "./Wallet.module.scss";

import useWallet from "../../../utils/useWallet";
import useModal from "../../../utils/useModal";
import { channel, subscribe } from "../../../utils/useChannel";

import HistoryIcon from "../../../public/images/sidebar/history.png";
import WithdrawIcon from "../../../public/images/sidebar/withdraw.png";
import VoucherIcon from "../../../public/images/sidebar/voucher.png";

const Wallet = ({ t, isResponsive }) => {
    const { wallet, walletState, refreshWallet, setWallet } = useWallet();
    const { setModal: setModalBilling } = useModal("topup-billing");
    const { setModal: setModalRedeem } = useModal("redeem-voucher");
    const { setModal: setModalWithdraw } = useModal("withdraw-point");

    useEffect(() => {
        if (channel) {
            subscribe("balance", (data) => {
                console.log("balance websocket", data);
                if (!data.message) return;
                setWallet(data.message.balance);
            });
        }
    }, [channel]);

    return (
        <div className={styles.container} style={{ marginBottom: isResponsive && "1.5rem" }}>
            <div className={styles.top}>
                <div>
                    <span>{t("balance")}</span>
                    {walletState === "reject" ? (
                        <span className={styles.value} onClick={refreshWallet} style={{ cursor: "pointer" }}>
                            Refresh
                        </span>
                    ) : (
                        <span className={styles.value}>{wallet}</span>
                    )}
                </div>
                <button onClick={() => setModalBilling(true)}>Isi Poin</button>
            </div>
            <div className={styles.bottom}>
                <Link href="/history" passHref>
                    <a>
                        <button>
                            <Image src={HistoryIcon.src} alt="history" height={14} width={14} />
                            History
                        </button>
                    </a>
                </Link>
                <div className={styles.separator} />
                <a onClick={() => setModalRedeem(true)}>
                    <button>
                        <Image src={VoucherIcon.src} alt="voucher" height={14} width={14} />
                        Voucher
                    </button>
                </a>
                <div className={styles.separator} />
                <a onClick={() => setModalWithdraw(true)}>
                    <button>
                        <Image src={WithdrawIcon.src} alt="withdraw" height={14} width={14} />
                        Withdraw
                    </button>
                </a>
            </div>
        </div>
    );
};

Wallet.propTypes = {
    isResponsive: PropTypes.bool,
    t: PropTypes.func,
};

export default Wallet;
