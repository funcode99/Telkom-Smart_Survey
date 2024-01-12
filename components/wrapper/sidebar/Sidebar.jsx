import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import styles from "./Sidebar.module.scss";

import Header from "../header/Header";
import ModalTopup from "../../payment/ModalTopup";
import ModalFeedback from "../../modal/ModalFeedback";
import ModalRedeem from "../../modal/ModalRedeem";
import ModalWithdraw from "../../withdraw/ModalWithdraw";

import Logo from "./Logo";
import Avatar from "./Avatar";
import Wallet from "./Wallet";
import Option from "./Option";

const Sidebar = ({ children, style }) => {
    const [isResponsive, setResponsive] = useState(typeof window !== "undefined" ? window.innerWidth <= 768 : false);
    const [isHide, setHide] = useState(true);
    const { t } = useTranslation("common");

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setResponsive(true);
            } else {
                setResponsive(false);
            }
        };

        if (window !== "undefined") window.addEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setHide(true);
    }, [isResponsive]);

    return (
        <div className={styles.container}>
            <div className={styles.header_background} />
            <div className={styles.sidebar_container} style={{ left: isHide ? null : 0, position: isResponsive && "fixed" }}>
                {isResponsive && !isHide && <div className={styles.sidebar_overlay} onClick={() => setHide(true)} />}
                <nav className={styles.sidebar}>
                    <Logo isResponsive={isResponsive} close={() => setHide(true)} />
                    <Avatar t={t} isResponsive={isResponsive} />
                    <Wallet t={t} isResponsive={isResponsive} />
                    <Option t={t} isResponsive={isResponsive} />
                </nav>
            </div>

            <div className={styles.content}>
                <Header isResponsive={isResponsive} toggleClick={() => setHide(!isHide)} />
                <div className={styles.main_container} style={style}>
                    {children}
                </div>
            </div>

            <ModalTopup />
            <ModalFeedback />
            <ModalRedeem text={t} />
            <ModalWithdraw text={t} />
        </div>
    );
};

Sidebar.propTypes = {
    children: PropTypes.node,
    tourRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.elementType })]),
};

export default Sidebar;
