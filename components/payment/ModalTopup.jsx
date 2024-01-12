import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import styles from "./ModalTopup.module.scss";

import { MdArrowBack, MdClose } from "react-icons/md";
import { FiPlus, FiMinus } from "react-icons/fi";
import useModal from "../../utils/useModal";
import Skeleton from "react-loading-skeleton";
import { getAllItem } from "../../utils/api/voucherApi";
import { convertRupiah } from "../../utils/functions";

import ModalContainer from "../modal/ModalContainer";
import { Button } from "../global/Button";

const customPackage = {
    itemId: "911928cb-4943-47c2-822f-10932d8b4e3d",
    itemName: "Custom Package",
    itemRate: 100,
    minUnit: 1,
    walletPoint: 1,
    isCustom: true,
};

const Card = ({ label, value, price, onClick, isLoading, isCustom }) => {
    return (
        <div className={styles.card} onClick={onClick}>
            {isLoading ? (
                <div style={{ height: 91, width: "100%", cursor: "wait" }}>
                    <Skeleton height={100} width="100%" style={{ transform: "translateY(-0.0625rem)" }} />
                </div>
            ) : (
                <>
                    <div className={styles.left}>
                        <label>{label}</label>
                        <span>{value}</span>
                    </div>
                    {!isCustom && (
                        <div className={styles.right}>
                            <label>{convertRupiah(price)}</label>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const TopupDetail = ({ item, setModal, setSelectedPackage }) => {
    const [unit, setUnit] = useState(item.isCustom ? 50 : item.minUnit);
    const [price, setPrice] = useState(unit * item.itemRate);
    const router = useRouter();

    console.log(item);
    useEffect(() => {
        setPrice(unit * item.itemRate);
    }, [unit]);

    const submitHandler = () => {
        router.push({ pathname: "/payment", query: { itemId: item.itemId, unit } });

        // setLoading(true);
        // createBilling({ itemId: item.itemId, unit })
        //     .then((resolve) => {
        //         window.open(resolve.paymentGateway.redirect_url);
        //         setModal(false);
        //     })
        //     .catch((reject) => {
        //         console.log(reject);
        //         toast.error(reject);
        //     })
        //     .finally(() => {
        //         setLoading(false);
        //     });
    };

    return (
        <div className={styles.detail_container}>
            <div className={styles.header}>
                <MdArrowBack onClick={() => setSelectedPackage({})} className={styles.back_icon} />
                <h5>{item.isCustom ? "Custom Package" : "Order Summary"}</h5>
                <MdClose
                    onClick={async () => {
                        setModal(false);
                    }}
                />
            </div>
            <div className={styles.body}>
                {item.isCustom && (
                    <div className={styles.row + " " + styles.quantity}>
                        <span>Poin</span>
                        <div className={styles.adjust}>
                            <button
                                className={styles.left}
                                onClick={() => {
                                    if (unit > 50) setUnit(unit - 50);
                                }}
                            >
                                <FiMinus />
                            </button>
                            <div className={styles.center}>{unit}</div>
                            <button
                                className={styles.right}
                                onClick={() => {
                                    if (unit < 10000) setUnit(unit + 50);
                                }}
                            >
                                <FiPlus />
                            </button>
                        </div>
                    </div>
                )}
                <div className={styles.row}>
                    <span>Subtotal</span>
                    <span className={styles.price}>{convertRupiah(price)}</span>
                </div>
                <div className={styles.row}>
                    <span>PPN 10%</span>
                    <span className={styles.price}>{convertRupiah(price / 10)}</span>
                </div>
                <div className={styles.row + " " + styles.total}>
                    <span>Total</span>
                    <span className={styles.price}>{convertRupiah(price + price / 10)}</span>
                </div>
            </div>
            <Button style={{ width: "100%", marginTop: "40px" }} onClick={submitHandler}>
                SELECT PAYMENT
            </Button>
        </div>
    );
};

const ModalTopup = () => {
    const [packageList, setPackageList] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState({});
    const [listLoading, setListLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const { modal, setModal } = useModal("topup-billing");

    const getData = () => {
        setListLoading(true);
        getAllItem()
            .then((resolve) => {
                setPackageList(resolve);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setListLoading(false);
            });
    };

    useEffect(() => {
        if (modal) getData();
    }, [modal]);

    return (
        <ModalContainer
            show={modal}
            NextComponent={selectedPackage.itemId && TopupDetail}
            nextProps={{ item: selectedPackage, setModal, setSelectedPackage, isLoading: paymentLoading, setLoading: setPaymentLoading }}
            onClose={() => setSelectedPackage({})}
            isLoading={paymentLoading}
        >
            {/* <Script
                id="midtrans"
                src="https://app.sandbox.midtrans.com/snap/snap.js"
                data-client-key="SB-Mid-client-88UaNljsbn9AG5-S"
                strategy="beforeInteractive"
                onLoad={() => {
                    console.log("script load succesfully");
                }}
            /> */}
            <div className={styles.header}>
                <h5>Topup SmartSurvey Balance</h5>
                <MdClose onClick={() => setModal(false)} />
            </div>
            <div className={styles.body}>
                {listLoading ? (
                    Array.from({ length: 4 }).map((_, index) => {
                        return <Card isLoading key={index} />;
                    })
                ) : (
                    <>
                        {packageList.map((item) => {
                            if (item.itemId === customPackage.itemId) return;

                            return (
                                <Card
                                    key={item.itemId}
                                    label={item.itemName}
                                    value={item.walletPoint}
                                    price={item.itemRate}
                                    onClick={() => {
                                        setSelectedPackage(item);
                                    }}
                                />
                            );
                        })}
                        <Card
                            key={customPackage.itemId}
                            label={customPackage.itemName}
                            value={"Custom"}
                            price={customPackage.itemRate}
                            onClick={() => {
                                setSelectedPackage(customPackage);
                            }}
                            isCustom
                        />
                    </>
                )}
            </div>
        </ModalContainer>
    );
};

const props = {
    label: PropTypes.string,
    value: PropTypes.oneOf([PropTypes.number, "Custom"]),
    price: PropTypes.number,
    onClick: PropTypes.func,
    isLoading: PropTypes.bool,
    isCustom: PropTypes.bool,
};

Card.propTypes = props;

TopupDetail.propTypes = {
    item: PropTypes.shape(props),
    setModal: PropTypes.func,
    setSelectedPackage: PropTypes.func,
    isLoading: PropTypes.bool,
    setLoading: PropTypes.func,
};

export default ModalTopup;
