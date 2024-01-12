import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styles from "./Payment.module.scss";

import { checkBilling } from "../../utils/api/voucherApi";
import { channel, subscribe } from "../../utils/useChannel";

import Header from "../../components/survey/Header";
import Spinner from "../../components/global/Spinner";
import Success from "../../components/payment/SuccessCard.jsx";
import VirtualAccount from "../../components/payment/method/VirtualAccount";
import Gopay from "../../components/payment/method/Gopay";

const Card = ({ data, redirect }) => {
    switch (data?.payment_type) {
        case "success":
            return <Success redirect={redirect} />;
        case "bank_transfer":
            return <VirtualAccount data={data} />;
        case "gopay":
            return <Gopay data={data} />;
        default:
            return null;
    }
};

const TopupDetail = () => {
    const [data, setData] = useState({});
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        checkBilling(router.query.billingId)
            .then((resolve) => {
                console.log(resolve);
                if (resolve.status === "settlement") {
                    setData({ payment_type: "success" });
                } else {
                    setData(resolve.paymentGateway);
                }
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        console.log(channel);
        if (channel) {
            subscribe("payment", (data) => {
                console.log("payment", data);
                const message = data.message;
                const billingId = router.query.billingId;
                if (message.billingId === billingId && router.pathname === "/payment/[billingId]" && message.status === "settlement") {
                    setData({ payment_type: "success" });
                }
            });
            subscribe("billing", (data) => {
                console.log("billing", data);
                const message = data.message;
                const billingId = router.query.billingId;
                if (message.billingId === billingId && router.pathname === "/payment/[billingId]" && message.status === "settlement") {
                    setData({ payment_type: "success" });
                }
            });
        }
    }, [channel]);

    return (
        <div className={styles.container}>
            <Header redirect />
            <div className={styles.background} />
            {isLoading ? (
                <div className={styles.loading}>
                    <Spinner />
                </div>
            ) : (
                <Card data={data} redirect={router.query?.redirect} />
            )}
        </div>
    );
};

Card.propTypes = {
    data: PropTypes.shape({
        payment_type: PropTypes.string,
    }),
    redirect: PropTypes.string,
};

export const getServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "payment"])),
    },
});

export default TopupDetail;
