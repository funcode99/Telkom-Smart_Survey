import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Link from "next/link";
import styles from "./Notification.module.scss";

import { useRecoilState } from "recoil";
import { notification } from "../../../utils/recoil";
import { channel, subscribe } from "../../../utils/useChannel";
import IconBell from "../../../public/images/icon_bell.svg";
import useOverlay from "../../../utils/useOverlay";

const Notification = ({ isResponsive }) => {
    const [isBadge, setBadge] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const [notificationList, setNotificationList] = useRecoilState(notification);
    useOverlay(isOpen, setOpen, "header-notification");

    useEffect(() => {
        if (channel) {
            subscribe("transaction", (data) => {
                if (!isOpen) setBadge(true);
                setNotificationList([data.message, ...notificationList]);
            });
        }
    }, [channel]);

    useEffect(() => {
        if (!isOpen) setBadge(false);
    }, [isOpen]);

    return (
        <div className={styles.container + (isResponsive ? " " + styles.mobile : "")} id="header-notification">
            <button className={styles.notification_icon} onClick={() => setOpen(!isOpen)}>
                <IconBell />
                {isBadge && <div className={styles.dot_badge} />}
            </button>
            {isOpen && (
                <div className={styles.notification_panel}>
                    {notificationList.map((notification, index) => {
                        if (index > 2) return;

                        return (
                            <div className={styles.notification_list} key={index}>
                                <span className={styles.date}>{moment(notification.createdAt).format("DD MMM YYYY")}</span>
                                <span className={styles.activity}>{notification.activity}</span>
                            </div>
                        );
                    })}
                    {notificationList.length ? (
                        <div className={styles.more}>
                            <Link href="/history">View All</Link>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

Notification.propTypes = {
    isResponsive: PropTypes.bool,
};

export default Notification;
