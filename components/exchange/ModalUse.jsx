import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import { useSwipeable } from "react-swipeable";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import styles from "./Modal.module.scss";

import { redeemVoucherExchange } from "../../utils/api/voucherApi";
import { MdClose, MdOutlineArrowForwardIos } from "react-icons/md";
import useModal from "../../utils/useModal";

import ModalContainer from "../modal/ModalContainer";

const ModalUse = ({ refresh }) => {
    const [position, setPosition] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [voucher, setVoucher] = useState({});
    const [isLoading, setLoading] = useState(false);
    const { modal, setModal, data } = useModal("use-voucher");
    const buttonRef = useRef();
    const sliderRef = useRef();

    const { t } = useTranslation("exchange");

    useEffect(() => {
        if (data._id) setVoucher({ ...data, ...data.item });
    }, [data]);

    const submitHandler = () => {
        setLoading(true);
        redeemVoucherExchange({ reedemCode: voucher.reedemCode })
            .then((resolve) => {
                console.log(resolve);
                refresh();
                toast.info(t("success_use_voucher"));
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setModal(false);
            });
    };

    const handlers = useSwipeable({
        onSwipedRight: () => {
            if (isLoading) return;
            if (buttonRef.current) buttonRef.current.style.transition = ".5s";
            setPosition(0);
        },
        onSwiping: (e) => {
            if (isLoading) return;
            const maxWidth = sliderRef.current?.clientWidth;
            if (buttonRef.current) buttonRef.current.style.transition = "0s";
            if (e.absX < 0 && e.dir === "Right") {
                setPosition(0);
            } else if (e.absX <= maxWidth && e.dir === "Right") {
                setPosition(e.absX);

                if (e.absX >= maxWidth - 50) submitHandler();
            }
        },
        trackMouse: true,
    });

    return (
        <ModalContainer
            show={modal}
            customContainer={{ padding: "1.5rem 1.875rem", maxWidth: "28rem" }}
            onClose={() => {
                setPosition(0);
                setLoading(false);
                setVoucher({});
            }}
            isLoading={isLoading}
        >
            <div className={styles.title}>
                <h5>{t("exchange_detail")}</h5>
                <MdClose className={styles.close} onClick={() => setModal(false)} />
            </div>
            <div className={styles.image}>
                <Image alt="banner" src={voucher.banner} layout="fill" objectFit="cover" />
            </div>
            <div className={styles.name}>{voucher.itemName}</div>
            <p className={styles.description}>{voucher.desc}</p>
            <p className={styles.guide}>
                {t("voucher_warning_1")}
                <br />
                <span>{t("voucher_warning_2")}</span>
            </p>
            <div className={styles.swipe_container}>
                <div className={styles.button_swipe} ref={sliderRef}>
                    <button
                        {...handlers}
                        style={{ left: position }}
                        ref={buttonRef}
                        onTouchStart={(e) => {
                            if (isLoading) return;
                            buttonRef.current.style.transition = "0s";
                            setTouchStart(e.touches[0].clientX);
                        }}
                        onTouchEnd={() => {
                            if (isLoading) return;
                            buttonRef.current.style.transition = ".5s";
                            setPosition(0);
                        }}
                        onTouchMove={(e) => {
                            if (isLoading) return;
                            const maxWidth = sliderRef.current?.clientWidth;
                            const absX = e.touches[0].clientX - touchStart;

                            if (absX < 0) {
                                setPosition(0);
                            } else if (absX <= maxWidth) {
                                setPosition(absX);

                                if (absX >= maxWidth - 50) submitHandler();
                            }
                        }}
                    >
                        <MdOutlineArrowForwardIos />
                        <MdOutlineArrowForwardIos className={styles.transform} />
                    </button>
                    <label>{t("voucher_slider")}</label>
                </div>
            </div>
        </ModalContainer>
    );
};

ModalUse.propTypes = {
    text: PropTypes.func,
    refresh: PropTypes.func,
};

export default ModalUse;
