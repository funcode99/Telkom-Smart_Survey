import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import styles from "./Payment.module.scss";

import ProgressBar from "../../components/global/ProgressBar";
import Header from "../../components/survey/Header";

import MainCard from "../../components/payment/MainCard";
import AtmCard from "../../components/payment/AtmCard";
import EWalletCard from "../../components/payment/EWalletCard";
import DebitCard from "../../components/payment/DebitCard";

const Card = (props) => {
    switch (props.menu) {
        case "bank-tranfer":
            return <AtmCard {...props} isSubscription />;
        case "e-wallet":
            console.log("wallet nih");
            return <EWalletCard {...props} isSubscription />;
        case "debit-credit":
            return <DebitCard {...props} isSubscription />;
        default:
            return <MainCard {...props} />;
    }
};

const Topup = () => {
    const [menu, setMenu] = useState("main"); // atm, e-wallet, debit
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const { duration } = router.query;
        if (!duration) router.replace("/");
    }, []);

    return (
        <div className={styles.container}>
            <Header redirect />
            <ProgressBar show={isLoading} />
            <div className={styles.background} />
            <Card menu={menu} setMenu={setMenu} isLoading={isLoading} setLoading={setLoading} data={router.query} />
        </div>
    );
};

Card.propTypes = {
    menu: PropTypes.string,
};

export default Topup;
