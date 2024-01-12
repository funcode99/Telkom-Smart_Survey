import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Image from "next/image";
import { toast } from "react-toastify";
import styles from "./Card.module.scss";

import { createBilling, buySubscription } from "../../utils/api/voucherApi";
import { MdArrowBack, MdOutlineArrowForwardIos } from "react-icons/md";
import MainLogo from "../../public/images/topup/main_logo.svg";
import WalletIcon from "../../public/images/topup/wallet.png";

const AtmCard = ({ data, setMenu, isLoading, setLoading, isSubscription }) => {
    const router = useRouter();

    const submitHandler = (source) => {
        if (isLoading) return;

        const submitApi = isSubscription ? buySubscription : createBilling;
        const submitData = isSubscription
            ? {
                  pricingId: "a938334e-fe23-4f63-9f64-ac53c6963c69",
                  paymentMethod: source.replace("-va", ""),
                  periodType: data.duration,
              }
            : {
                  itemId: data.itemId,
                  unit: data.unit,
              };

        setLoading(true);
        submitApi(submitData, "/bank-transfer/" + source)
            .then((resolve) => {
                console.log(resolve);
                router.push("/payment/" + resolve.billingId);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className={styles.container}>
            <MainLogo />
            <div className={styles.title} onClick={() => setMenu("main")}>
                <MdArrowBack />
                <h5>ATM/Bank Tranfer</h5>
            </div>
            <div className={styles.card_container}>
                <div className={styles.card} onClick={() => submitHandler("bni-va")}>
                    <Image alt="wallet-icon" src={WalletIcon.src} width={32} height={32} />
                    <div className={styles.body}>
                        <label>BNI Virtual Account</label>
                    </div>
                    <MdOutlineArrowForwardIos />
                </div>
                <div className={styles.card} onClick={() => submitHandler("bri-va")}>
                    <Image alt="wallet-icon" src={WalletIcon.src} width={32} height={32} />
                    <div className={styles.body}>
                        <label>BRI Virtual Account</label>
                    </div>
                    <MdOutlineArrowForwardIos />
                </div>
                <div className={styles.card} onClick={() => submitHandler("mandiri-va")}>
                    <Image alt="wallet-icon" src={WalletIcon.src} width={32} height={32} />
                    <div className={styles.body}>
                        <label>Mandiri Virtual Account</label>
                    </div>
                    <MdOutlineArrowForwardIos />
                </div>
                <div className={styles.card} onClick={() => submitHandler("permata-va")}>
                    <Image alt="wallet-icon" src={WalletIcon.src} width={32} height={32} />
                    <div className={styles.body}>
                        <label>Permata Virtual Account</label>
                    </div>
                    <MdOutlineArrowForwardIos />
                </div>
            </div>
        </div>
    );
};

AtmCard.propTypes = {
    data: PropTypes.shape({
        itemId: PropTypes.string,
        unit: PropTypes.number,
        duration: PropTypes.oneOf(["month", "year"]),
    }),
    setMenu: PropTypes.func,
    isLoading: PropTypes.bool,
    setLoading: PropTypes.func,
    isSubscription: PropTypes.bool,
};

export default AtmCard;
