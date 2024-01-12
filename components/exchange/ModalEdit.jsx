import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import styles from "./ModalEdit.module.scss";

import { updateItemExchange, deleteItemExchange } from "../../utils/api/voucherApi";
import { uploadFile } from "../../utils/functions";
import DateIcon from "../../public/images/survey/date_icon.svg";
import { DateTimePicker } from "@material-ui/pickers";
import useModal from "../../utils/useModal";

import ModalContainer from "../modal/ModalContainer";
import Input from "../global/Input";
import { ButtonContainer, Button } from "../global/Button";
import Popup from "../global/Popup";

const ModalEdit = ({ text, text_common, refresh }) => {
    const [isLoading, setLoading] = useState(false);
    const [isPopup, setPopup] = useState(null);
    const { modal, data, setModal } = useModal("edit-voucher");
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (modal && data.itemId) {
            reset({
                itemName: data.itemName,
                desc: data.desc,
                price: data.price,
                qty: data.qty,
                expDate: data.expDate,
                banner: { metadata: { name: data.banner } },
            });
        }
    }, [modal]);

    const submitHandler = (input, e) => {
        e.preventDefault();
        setLoading(true);

        const newInput = { ...input };
        if (input.banner?.data) {
            newInput.banner = input.banner?.data;
        } else {
            delete newInput.banner;
        }

        updateItemExchange(newInput, data.itemId)
            .then(async (resolve) => {
                console.log(resolve);
                refresh();
                toast.info(`Update voucher success`);
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

    const deleteHandler = () => {
        setLoading(true);
        deleteItemExchange(data.itemId)
            .then(() => {
                refresh();
                toast.info(`Delete voucher success`);
                setModal(false);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
                setLoading(false);
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
                modalProps={{ isLoading }}
                title="Delete this voucher ?"
                cancelButton={{
                    onClick: () => setPopup(false),
                }}
                submitButton={{
                    onClick: () => deleteHandler(),
                    isLoading,
                }}
            />
        );
    }

    return (
        <ModalContainer
            show={modal}
            isLoading={isLoading}
            customContainer={{ width: "28rem", overflowY: "visible" }}
            onClose={() => {
                setLoading(false);
                reset();
            }}
        >
            <form onSubmit={handleSubmit(submitHandler)}>
                <div className={styles.title}>
                    <h5>Edit Voucher</h5>
                </div>
                <Input
                    controller={register("itemName", {
                        required: text_common("error_required"),
                    })}
                    error={errors.itemName}
                    label={text("voucher_name")}
                />
                <Input label={text("voucher_description")} error={errors.desc}>
                    <textarea
                        {...register("desc", {
                            required: text_common("error_required"),
                        })}
                    />
                </Input>
                <div className={styles.column}>
                    <Input
                        controller={register("price", {
                            required: text_common("error_required"),
                        })}
                        type="number"
                        error={errors.price}
                        label={text("voucher_price")}
                    />
                    <Input
                        controller={register("qty", {
                            required: text_common("error_required"),
                        })}
                        type="number"
                        error={errors.qty}
                        label={text("voucher_quantity")}
                    />
                </div>
                <Input label={text("voucher_expired")} error={errors.expDate}>
                    <Controller
                        control={control}
                        name="expDate"
                        rules={{ required: text_common("error_required") }}
                        render={({ field: { value, onChange } }) => {
                            return (
                                <div className={styles.date_picker}>
                                    <DateTimePicker
                                        TextFieldComponent={(prop) => {
                                            return <input onClick={prop.onClick} value={prop.value} onChange={prop.onChange} />;
                                        }}
                                        format="DD MMMM yyyy, HH:mm"
                                        value={value ? moment(value).toDate() : null}
                                        onChange={(date) => {
                                            onChange(date.format("YYYY-MM-DDTHH:mmZ"));
                                        }}
                                    />
                                    <DateIcon />
                                </div>
                            );
                        }}
                    />
                </Input>
                <Input label={text("voucher_image")} error={errors.banner}>
                    <Controller
                        control={control}
                        name="banner"
                        rules={{ required: text_common("error_required") }}
                        render={({ field: { value, onChange } }) => {
                            return (
                                <div className={styles.image_picker}>
                                    <input disabled className={styles.dummy} />
                                    <input disabled className={styles.text} value={value?.metadata?.name} />
                                    <Button
                                        type="button"
                                        onClick={async () => {
                                            const image = await uploadFile();
                                            if (image.error) return toast.error(image.error);
                                            onChange(image);
                                        }}
                                    >
                                        {text_common("image_picker")}
                                    </Button>
                                </div>
                            );
                        }}
                    />
                </Input>
                {!isLoading && (
                    <span className={styles.delete} onClick={() => setPopup(true)}>
                        Delete Voucher
                    </span>
                )}

                <ButtonContainer style={{ marginTop: "1rem" }}>
                    <Button style={{ flex: 1 }} isTransparent onClick={() => setModal(false)}>
                        {text_common("cancel")}
                    </Button>
                    <Button style={{ flex: 1 }} isLoading={isLoading} isSubmit>
                        {text_common("save")}
                    </Button>
                </ButtonContainer>
            </form>
        </ModalContainer>
    );
};

ModalEdit.propTypes = {
    text: PropTypes.func,
    text_common: PropTypes.func,
    refresh: PropTypes.func,
};

export default ModalEdit;
