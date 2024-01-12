import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import styles from "./ModalReward.module.scss";

import { getAllItemExchange, transferPoint, setRewardSurvey } from "../../../utils/api/voucherApi";
import { convertRupiah } from "../../../utils/functions";
import { BiMinus, BiPlus } from "react-icons/bi";
import useModal from "../../../utils/useModal";
import { useRecoilValue } from "recoil";
import { userProfile } from "../../../utils/recoil";
import { useTranslation } from "next-i18next";
import useWallet from "../../../utils/useWallet";

import ModalContainer from "../../modal/ModalContainer";
import RadioButton from "../../global/RadioButton";
import Input from "../../global/Input";
import Dropdown from "../../global/Dropdown";
import Popup from "../../global/Popup";
import { ButtonContainer, Button } from "../../global/Button";

const ModalReward = ({ setSurvey }) => {
    const [mode, setMode] = useState("point");
    const [isLoading, setLoading] = useState(false);
    const [isPopup, setPopup] = useState(false);
    const [voucher, setVoucher] = useState(null);
    const [voucherList, setVoucherList] = useState([]);
    const [voucherLoading, setVoucherLoading] = useState(false);
    const { modal, setModal } = useModal("add-reward");
    const profile = useRecoilValue(userProfile);
    const { wallet } = useWallet();
    const { t } = useTranslation("edit-survey");
    const { t: t_c } = useTranslation("common");
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const pointPerRespondent = watch(mode === "point" ? "pointPerRespondent" : "voucherPerRespondent");
    const qty = watch("qty");

    useEffect(() => {
        if (modal) reset({ pointPerRespondent: 10, qty: 10 });
    }, [modal]);

    const getVoucher = () => {
        setVoucherLoading(true);
        getAllItemExchange({ page: 1, row: 100, status: "verified", userId: profile.userId, isExpired: "false" })
            .then((resolve) => {
                setVoucherList(resolve.lists);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setVoucherLoading(false);
            });
    };

    useEffect(() => {
        if (mode === "voucher" && !voucherList.length) getVoucher();
    }, [mode]);

    const onSubmit = (input, e) => {
        e.preventDefault;

        const setReward = mode === "point" ? transferPoint : setRewardSurvey;
        console.log(input);

        setLoading(true);
        setReward({ ...input, surveyId: router.query.surveyId })
            .then((resolve) => {
                console.log(resolve);
                setSurvey(mode === "point" ? { transferPoint: resolve } : { voucherReward: resolve });
                setPopup(true);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (isPopup) {
        return (
            <Popup
                show={modal}
                setPopup={setPopup}
                icon="ok"
                title={t("success_add_reward")}
                submitButton={{
                    label: t_c("ok"),
                    onClick: () => setModal(false),
                }}
            />
        );
    }

    return (
        <ModalContainer
            show={modal}
            isLoading={isLoading}
            onClose={() => {
                setVoucher(null);
                setMode("point");
                reset();
            }}
            customContainer={{
                padding: "1.5rem",
                borderRadius: ".625rem",
            }}
        >
            <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
                <h5 className={styles.title}>{t("reward_title")}</h5>
                <Input
                    label={t("reward_type")}
                    labelStyle={{
                        color: "#66686A",
                        marginBottom: ".375rem",
                    }}
                >
                    <RadioButton
                        className={styles.radio}
                        value={mode}
                        onChange={(value) => {
                            reset(value === "point" ? { pointPerRespondent: 10, qty: 10 } : { voucherPerRespondent: 1, qty: 10, itemId: "" });
                            setMode(value);
                            setVoucher(null);
                        }}
                        list={[
                            { label: t_c("point"), value: "point" },
                            { label: t_c("voucher"), value: "voucher" },
                        ]}
                    />
                </Input>
                <Input error={mode === "point" ? errors.pointPerRespondent : errors.voucherPerRespondent}>
                    <div className={styles.input}>
                        <div className={styles.left}>
                            <span>{t("reward_per_respondent")}</span>
                        </div>
                        <div className={styles.center}>
                            <button
                                type="button"
                                onClick={() => {
                                    setValue(mode === "point" ? "pointPerRespondent" : "voucherPerRespondent", pointPerRespondent - 1);
                                }}
                            >
                                <BiMinus />
                            </button>
                            <input
                                {...register(mode === "point" ? "pointPerRespondent" : "voucherPerRespondent", {
                                    valueAsNumber: true,
                                    required: t_c("error_required"),
                                    min: {
                                        value: mode === "point" ? 10 : 1,
                                        message: mode === "point" ? "Minimum value adalah 10 poin" : "Minimum value adalah 1 voucher",
                                    },
                                })}
                                type="number"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setValue(mode === "point" ? "pointPerRespondent" : "voucherPerRespondent", pointPerRespondent + 1);
                                }}
                            >
                                <BiPlus />
                            </button>
                        </div>
                        <div className={styles.right}>
                            <span>{t_c(mode === "point" ? "point" : "voucher")}</span>
                        </div>
                    </div>
                </Input>
                <Input error={errors.qty}>
                    <div className={styles.input}>
                        <div className={styles.left}>
                            <span>{t("reward_total_respondent")}</span>
                        </div>
                        <div className={styles.center}>
                            <button
                                type="button"
                                onClick={() => {
                                    setValue("qty", qty - 1);
                                }}
                            >
                                <BiMinus />
                            </button>
                            <input
                                {...register("qty", {
                                    valueAsNumber: true,
                                    required: t_c("error_required"),
                                    min: {
                                        value: 10,
                                        message: "Minimum value adalah 10 orang",
                                    },
                                    validate: {
                                        insufficient: () => {
                                            if (mode === "point") {
                                                return wallet >= qty * pointPerRespondent || t("error_insufficient_point");
                                            } else {
                                                return voucher?.qty >= qty * pointPerRespondent || t("error_insufficient_voucher");
                                            }
                                        },
                                    },
                                })}
                                type="number"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setValue("qty", qty + 1);
                                }}
                            >
                                <BiPlus />
                            </button>
                        </div>
                        <div className={styles.right}>
                            <span>{t_c("person")}</span>
                        </div>
                    </div>
                </Input>
                {mode === "voucher" && (
                    <Input label={t("reward_voucher")} style={{ marginTop: "1.5rem" }} error={errors.itemId}>
                        <Controller
                            control={control}
                            name="itemId"
                            rules={{
                                required: t_c("error_required"),
                            }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => {
                                return (
                                    <Dropdown
                                        id="dropdown-reward-voucher"
                                        value={value}
                                        placeholder={t("reward_voucher")}
                                        onSelect={(itemId, item) => {
                                            onChange(itemId);
                                            setVoucher(item);
                                        }}
                                        options={voucherList.map((voucher) => ({
                                            label: (
                                                <span>
                                                    <b>{voucher.qty}x</b> {voucher.itemName}
                                                </span>
                                            ),
                                            value: voucher.itemId,
                                            data: voucher,
                                        }))}
                                        isLoading={voucherLoading}
                                        error={error}
                                        isFloating
                                    />
                                );
                            }}
                        />
                    </Input>
                )}
                {(mode === "point" || voucher?.itemId) && (
                    <div className={styles.description_container}>
                        <div className={styles.description}>
                            <span>{t(mode === "point" ? "reward_your_point" : "reward_your_voucher")}</span>
                            <label>{mode === "point" ? wallet : voucher.qty}</label>
                            <span className={styles.price}>
                                {mode === "point" ? convertRupiah(pointPerRespondent * qty * 100, { initial: "Rp", separator: "." }) : t_c("voucher")}
                            </span>
                        </div>
                        <div className={styles.description}>
                            <span>{t(mode === "point" ? "reward_point_for_reward" : "reward_voucher_for_reward")}</span>
                            <label style={{ color: "#7B6EE3" }}>{pointPerRespondent * qty}</label>
                            <span className={styles.price}>
                                {mode === "point" ? convertRupiah(pointPerRespondent * qty * 100, { initial: "Rp", separator: "." }) : t_c("voucher")}
                            </span>
                        </div>
                        <div className={styles.description + " " + styles.border}>
                            <span>{t(mode === "point" ? "reward_point_remain" : "reward_voucher_remain")}</span>
                            <label>{(mode === "point" ? wallet : voucher.qty) - pointPerRespondent * qty}</label>
                            <span className={styles.price}>
                                {mode === "point" ? convertRupiah(pointPerRespondent * qty * 100, { initial: "Rp", separator: "." }) : t_c("voucher")}
                            </span>
                        </div>
                    </div>
                )}

                <ButtonContainer style={{ marginTop: "1.625rem" }}>
                    <Button style={{ flex: 1 }} isTransparent onClick={() => setModal(false)}>
                        {t_c("cancel")}
                    </Button>
                    <Button style={{ flex: 1 }} isSubmit>
                        {t_c("next")}
                    </Button>
                </ButtonContainer>
            </form>
        </ModalContainer>
    );
};

ModalReward.propTypes = {
    setSurvey: PropTypes.func,
};

export default ModalReward;
