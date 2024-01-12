import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "next-i18next";
import styles from "./Modal.module.scss";

import { uploadFile } from "../../utils/functions";
import { getCategory, timeout } from "../../utils/functions";
import { userProfile } from "../../utils/recoil";
import { useRecoilValue } from "recoil";
import { createSurvey } from "../../utils/api/surveyApi";
import { createActivity } from "../../utils/api/activityApi";
import useModal from "../../utils/useModal";

import { ModalHeader as Header } from "../global/Header";
import Dropdown from "../global/Dropdown";
import ModalContainer from "../modal/ModalContainer";
import Input from "../global/Input";
import { ButtonContainer, Button } from "../global/Button";
import RadioButton from "../global/RadioButton";

const Modal = () => {
    const [isLoading, setLoading] = useState(false);
    const { modal, setModal } = useModal("new-survey");
    const profile = useRecoilValue(userProfile);
    const router = useRouter();
    const categoryList = getCategory(router.locale);
    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();
    const { t } = useTranslation("home");
    const { t: t_c } = useTranslation("common");
    const { t: t_e } = useTranslation("edit-survey");

    const submitHandler = (input, e) => {
        e.preventDefault();
        setLoading(true);

        const newInput = { ...input };
        if (input.surveyImage?.data) {
            newInput.surveyImage = input.surveyImage?.data;
        } else {
            delete newInput.surveyImage;
        }

        createSurvey({ ...newInput, publish: "public" })
            .then(async (resolve) => {
                await timeout(2000);
                toast.info(t_e("success_create_survey"));
                router.push("/edit-survey/" + resolve._id);

                setModal(false);
                const { userId, fullname, email, mobile } = profile;
                createActivity({ event: "create-survey", meta: { userId, fullname, email, mobile, ...input } });
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
                setLoading(false);

                const { userId, fullname, email, mobile } = profile;
                createActivity({ event: "create-survey-failed", meta: { reason: reject, userId, fullname, email, mobile, ...input } });
            });
    };

    useEffect(() => {
        if (modal) reset({ type: "survey" });
    }, [modal]);

    return (
        <ModalContainer
            show={modal}
            isLoading={isLoading}
            customContainer={{ width: "28rem", overflowY: "visible", padding: "1.5rem 1.75rem" }}
            onClose={() => {
                setLoading(false);
                reset({ type: "survey" });
            }}
        >
            <form onSubmit={handleSubmit(submitHandler)}>
                <Header
                    title={router.locale === "id" ? `${watch("type")} ${t("survey_new")}` : `${t("survey_new")} ${watch("type")}`}
                    titleStyle={{ textTransform: "capitalize" }}
                />
                <Input label={t("survey_type")} error={errors.type} style={{ marginBottom: "1.25rem" }}>
                    <Controller
                        control={control}
                        name="type"
                        rules={{ required: t_c("error_required") }}
                        render={({ field: { value, onChange } }) => {
                            return (
                                <RadioButton
                                    className={styles.radio}
                                    value={value}
                                    onChange={(value) => onChange(value)}
                                    list={[
                                        { label: "Survey", value: "survey" },
                                        { label: "Quiz", value: "quiz" },
                                    ]}
                                />
                            );
                        }}
                    />
                </Input>
                <Input
                    controller={register("title", {
                        required: t_c("error_required"),
                    })}
                    error={errors.title}
                    label={router.locale === "en" ? `${watch("type")} ${t("survey_title")}` : `${t("survey_title")} ${watch("type")}`}
                    labelStyle={{ textTransform: "capitalize" }}
                />
                <Input label={t("survey_category")} error={errors.categoryId}>
                    <Controller
                        control={control}
                        name="categoryId"
                        rules={{ required: t_c("error_required") }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => {
                            return (
                                <Dropdown
                                    id="dropdown-survey-category"
                                    placeholder={t("survey_category_placeholder")}
                                    options={categoryList}
                                    value={value}
                                    onSelect={(value) => onChange(value)}
                                    error={error}
                                    isFloating
                                />
                            );
                        }}
                    />
                </Input>
                <Input label={t("survey_description")} error={errors.description}>
                    <textarea
                        {...register("description", {
                            required: t_c("error_required"),
                        })}
                    />
                </Input>
                <Input label={t("survey_limit")} error={errors.fillLimit} style={{ marginBottom: "1.25rem" }}>
                    <Controller
                        control={control}
                        name="fillLimit"
                        rules={{ required: t_c("error_required") }}
                        render={({ field: { value, onChange } }) => {
                            return (
                                <RadioButton
                                    className={styles.radio}
                                    value={value}
                                    onChange={(value) => onChange(value)}
                                    list={[
                                        { label: t("survey_once"), value: "once" },
                                        { label: t("survey_unlimited"), value: "unlimited" },
                                    ]}
                                />
                            );
                        }}
                    />
                </Input>
                <Input
                    label={t("survey_image")}
                    message={<span className={styles.message}>{t("survey_image_info")}</span>}
                    error={errors.surveyImage}
                >
                    <Controller
                        control={control}
                        name="surveyImage"
                        rules={{
                            validate: {
                                type: (value) =>
                                    !value || ["jpg", "png", "jpeg"].some((type) => value?.metadata?.type.includes(type)) || t_c("error_image_type"),
                                size: (value) => !value || value?.metadata?.size <= 2000000 || t_c("error_image_size"),
                            },
                        }}
                        render={({ field: { value, onChange } }) => {
                            console.log(value);
                            return (
                                <div className={styles.image_picker}>
                                    <input disabled className={styles.dummy} />
                                    <input disabled className={styles.text} value={value?.metadata?.name} style={{ border: "none" }} />
                                    <Button
                                        type="button"
                                        onClick={async () => {
                                            const image = await uploadFile();
                                            if (image.error) return toast.error(image.error);
                                            onChange(image);
                                        }}
                                    >
                                        {t_c("image_picker")}
                                    </Button>
                                </div>
                            );
                        }}
                    />
                </Input>
                <ButtonContainer style={{ marginTop: "1.25rem" }}>
                    <Button style={{ flex: 1 }} isTransparent onClick={() => setModal(false)}>
                        {t_c("cancel")}
                    </Button>
                    <Button style={{ flex: 1 }} isLoading={isLoading} isSubmit>
                        {t("survey_create_mini")}
                    </Button>
                </ButtonContainer>
            </form>
        </ModalContainer>
    );
};

Modal.propTypes = {
    text: PropTypes.func,
    text_common: PropTypes.func,
};

export default Modal;
