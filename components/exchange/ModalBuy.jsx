import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import moment from "moment";
import styles from "./Modal.module.scss";

import { IoMdArrowRoundBack } from "react-icons/io";
import useModal from "../../utils/useModal";
import useWallet from "../../utils/useWallet";
import { exchangePoint } from "../../utils/api/voucherApi";

import ModalContainer from "../modal/ModalContainer";
import { ButtonContainer, Button } from "../global/Button";

const ModalConfirm = ({ voucher, back, close, isLoading, setLoading }) => {
    const { t } = useTranslation("exchange");
    const { t: t_c } = useTranslation("common");
    const { wallet } = useWallet();

    const submitHandler = () => {
        setLoading(true);
        exchangePoint({ itemId: voucher.itemId })
            .then((resolve) => {
                console.log(resolve);
                toast.info(t("success_buy_voucher"));
                close();
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
        <div className={styles.modal_confirm}>
            <div className={styles.title}>
                <IoMdArrowRoundBack className={styles.back} onClick={back} />
                <h5>{t("exchange_title")}</h5>
            </div>
            <div className={styles.list}>
                <span>{t("exchange_point")}</span>
                <label>{wallet}</label>
            </div>
            <div className={styles.list}>
                <span>{t("exchange_price")}</span>
                <label>{voucher.price}</label>
            </div>
            <div className={styles.list + " " + styles.border}>
                <span>{t("exchange_remain")}</span>
                <label>{wallet - voucher.price}</label>
            </div>
            <Button style={{ width: "21.8rem", textTransform: "uppercase" }} onClick={submitHandler} isLoading={isLoading}>
                {t_c("exchange")}
            </Button>
        </div>
    );
};

const ModalBuy = () => {
    const [voucher, setVoucher] = useState({});
    const [isLoading, setLoading] = useState(false);
    const [isConfirm, setConfirm] = useState(false);
    const { modal, setModal, data } = useModal("buy-voucher");
    const { wallet } = useWallet();

    const { t } = useTranslation("exchange");
    const { t: t_c } = useTranslation("common");

    useEffect(() => {
        console.log(data);
        if (data._id) setVoucher(data);
    }, [data]);

    return (
        <ModalContainer
            show={modal}
            customContainer={{ padding: "1.5rem 1.875rem", maxWidth: "28rem" }}
            NextComponent={isConfirm && ModalConfirm}
            nextProps={{
                voucher,
                isLoading,
                setLoading,
                back: () => setConfirm(false),
                close: () => setModal(false),
            }}
            onClose={() => {
                setConfirm(false);
                setVoucher({});
            }}
            isLoading={isLoading}
        >
            <div className={styles.title}>
                <h5>{t("exchange_title")}</h5>
            </div>
            <div className={styles.image}>
                <Image alt="banner" src={voucher.banner} layout="fill" objectFit="cover" />
            </div>
            <div className={styles.name}>{voucher.itemName}</div>
            <div className={styles.price}>
                {voucher.price} {t_c("point")}
            </div>
            <p className={styles.description}>{voucher.desc}</p>
            <div className={styles.split}>
                <label>
                    {t("voucher_valid_until")} {moment(voucher.expDate).format("DD-MM-YYYY")}
                </label>
                <span>
                    {t("voucher_sold")} <b>{voucher.totalQty - voucher.qty}</b> | {t("voucher_left")} <b>{voucher.qty}</b>
                </span>
            </div>
            {wallet < voucher.price && <div className={styles.error}>Poinmu tidak mencukupi</div>}
            <ButtonContainer>
                <Button style={{ flex: 1 }} isTransparent onClick={() => setModal(false)}>
                    {t_c("cancel")}
                </Button>
                <Button style={{ flex: 1 }} onClick={() => setConfirm(true)} isDisabled={wallet < voucher.price} isSubmit>
                    {t_c("exchange")}
                </Button>
            </ButtonContainer>
        </ModalContainer>
    );
};

ModalConfirm.propTypes = {
    back: PropTypes.func,
    close: PropTypes.func,
    isLoading: PropTypes.bool,
    setLoading: PropTypes.func,
    voucher: PropTypes.shape({
        itemId: PropTypes.string,
        price: PropTypes.number,
    }),
};

export default ModalBuy;
