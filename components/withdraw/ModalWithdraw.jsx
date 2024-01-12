import { useState } from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import styles from "./Modal.module.scss";

import { requestWithdraw } from "../../utils/api/withdrawApi";
import useModal from "../../utils/useModal";

import ModalContainer from "../modal/ModalContainer";
import Input from "../global/Input";
import { ButtonContainer, Button } from "../global/Button";
import Dropdown from "../global/Dropdown";

const ModalWithdraw = ({ text, }) => {
    const [isLoading, setLoading] = useState(false);
    const { modal, setModal } = useModal("withdraw-point");
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const { t } = useTranslation("common");

    const onSubmit = (input, e) => {
        e.preventDefault();

        setLoading(true);
        console.log(input);
        requestWithdraw(input)
            .then((resolve) => {
                console.log(resolve);
                toast.info("Request withdraw success, please wait until it accepted");
                setModal(false);
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
        <ModalContainer show={modal} isLoading={isLoading} customContainer={{ padding: "1.5rem 1.875rem" }} onClose={() => reset()}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.title}>
                    <h5>{text("withdraw_title")}</h5>
                </div>
                <Input
                    error={errors.point}
                    controller={register("point", {
                        required: t("error_required"),
                        min: {
                            value: 250,
                            message: "Minimum withdraw adalah 250 poin",
                        },
                    })}
                    label="Jumlah Poin Penukaranmu"
                    type="number"
                />
                <Input label="Tujuan Bank" error={errors.bank}>
                    <Controller
                        control={control}
                        name="bank"
                        rules={{ required: t("error_required") }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => {
                            return (
                                <Dropdown
                                    id="dropdown-bank-destination"
                                    placeholder="Pilih bank"
                                    options={[
                                        { label: "Bank BCA", value: "BCA" },
                                        { label: "Bank BRI", value: "BRI" },
                                        { label: "Bank BNI", value: "BNI" },
                                        { label: "Bank Mandiri", value: "MANDIRI" },
                                    ]}
                                    value={value}
                                    onSelect={(value) => onChange(value)}
                                    error={error}
                                    isFloating
                                />
                            );
                        }}
                    />
                </Input>
                <Input
                    error={errors.accountNumber}
                    controller={register("accountNumber", {
                        required: t("error_required"),
                    })}
                    label="Nomor Rekening"
                    type="number"
                />
                <ButtonContainer style={{ marginTop: "1rem" }}>
                    <Button type="button" style={{}} isTransparent onClick={() => setModal(false)}>
                        {text("cancel")}
                    </Button>
                    <Button style={{}} isSubmit>{text("next")}</Button>
                </ButtonContainer>
            </form>
        </ModalContainer>
    );
};

ModalWithdraw.propTypes = {
    text: PropTypes.func,
};

export default ModalWithdraw;
