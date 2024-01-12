import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Image from "next/image";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import styles from "./ModalQuestion.module.scss";

import { createQuestion, editQuestion } from "../../../utils/api/questionApi";
import { editSurvey } from "../../../utils/api/surveyApi";
import useModal from "../../../utils/useModal";
import { uploadFile } from "../../../utils/functions";

import { HiOutlineTrash } from "react-icons/hi";
import AddImageIcon from "../../../public/images/add_image.svg";

import { ButtonContainer, Button } from "../../global/Button";
import Dropdown from "../../global/Dropdown";
import ModalContainer from "../../modal/ModalContainer";
import Input from "../../global/Input";
import Options from "./Options";
import Range from "./Range";

const Modal = ({ addData, updateData, deleteData, surveyData, text, text_common, isFinal }) => {
    const [image, setImage] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const { modal, setModal, data: modalData } = useModal("edit-question");
    const router = useRouter();
    const surveyId = router.query.surveyId;
    const {
        register,
        unregister,
        control,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors },
    } = useForm();

    const options = [
        { label: text("type_text"), value: "text" },
        { label: text("type_option"), value: "option" },
        { label: text("type_checkbox"), value: "checkbox" },
        { label: text("type_image"), value: "file-image" },
        { label: text("type_range"), value: "range" },
    ];

    useEffect(() => {
        if (modalData.label) {
            let type = modalData.inputType;
            switch (modalData.inputType) {
                case "input-text":
                    type = "text";
                    break;
                case "file":
                    type = "file-image";
                    break;
                case "radio":
                    type = "option";
                    break;
                default:
                    break;
            }

            const input = { inputType: type, label: modalData.label };
            if (type === "range") {
                input.min = modalData.min || 1;
                input.max = modalData.max || 5;
                input.minLabel = modalData.minLabel;
                input.maxLabel = modalData.maxLabel;
            }
            if (["option", "checkbox", "radio"].includes(type)) {
                input.option = modalData.option || [{ label: "", value: "" }];
            }

            console.log(input);
            reset(input);
            setImage(modalData.questionImage || null);
        }
    }, [modalData]);

    useEffect(() => {
        if (!modalData.label) {
            reset({ inputType: "text", label: "" });
            setImage(null);
        }
    }, [modal]);

    const submitHandler = (input, e) => {
        e.preventDefault();
        console.log(input);
        modalData.label ? editHandler(input) : addHandler(input);
    };

    const addHandler = (input) => {
        setLoading(true);

        const args = { ...input, surveyId };
        if (image !== null) args.questionImage = image;

        createQuestion({ ...input, surveyId: surveyData.id })
            .then(async (resolve) => {
                const newData = resolve.questions[resolve.questions.length - 1] || {};
                reset();
                toast.info(text("success_add_question"));
                addData({ ...newData, _id: newData._id });
                setModal(false);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
                setLoading(false);
            });
    };

    const editHandler = (input) => {
        setLoading(true);

        const args = { ...input };
        if (image !== null && !image.includes("https://")) args.questionImage = image;

        console.log(args);

        editQuestion(args, modalData._id)
            .then((resolve) => {
                console.log(resolve);
                refreshQuestions(resolve);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
                setLoading(false);
            });
    };

    const uploadHandler = async () => {
        if (isFinal) return;

        const image = await uploadFile();
        if (image.error) return toast.error(image.error);
        setImage(image.data);
    };

    const refreshQuestions = (respond) => {
        editSurvey({ questions: surveyData.questions }, surveyId)
            .then(async () => {
                // await timeout(1000);
                toast.info(text("success_update_question"));
                updateData({ ...respond, _id: respond._id }, modalData.index);
                setModal(false);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
                setLoading(false);
            });
    };

    const deleteHandler = () => {
        setLoading(true);
        const array = [...surveyData.questions];
        array.splice(modalData.index, 1);

        editSurvey({ questions: array }, surveyId)
            .then(async () => {
                // await timeout(1000);
                setLoading(false);
                reset();
                toast.info(text("success_delete_question"));
                deleteData(modalData.index);
            })
            .catch((reject) => {
                console.log(reject);
                setLoading(false);
                toast.error(reject);
            });
    };

    return (
        <ModalContainer
            show={modal}
            customContainer={{ padding: "0 1.3rem", overflow: "visible" }}
            isLoading={isLoading}
            onClose={() => {
                setLoading(false);
                reset();
            }}
        >
            <form className={styles.container} onSubmit={handleSubmit(submitHandler)}>
                <div className={styles.header}>
                    <h3>
                        {modalData.label ? "Edit" : "Add"} {text("question_title")}
                    </h3>
                </div>
                <div className={styles.body}>
                    {modalData.label && (
                        <div className={styles.input_image}>
                            <label>{text("question_image")}</label>
                            <div className={styles.image_container} style={{ borderWidth: !image && 0 }}>
                                {image ? (
                                    <>
                                        <Image
                                            alt="image"
                                            src={image.includes("https://") ? image : `data:image/jpeg;base64,${image}`}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                        {!isFinal && (
                                            <div
                                                className={styles.delete_image}
                                                onClick={() => {
                                                    setImage("");
                                                }}
                                            >
                                                <HiOutlineTrash />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <AddImageIcon
                                        className={styles.add_image_button}
                                        onClick={uploadHandler}
                                        style={{ cursor: isFinal && "default" }}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                    <Input label={text("question_type")} className={styles.input} error={errors.inputType}>
                        <Controller
                            control={control}
                            name="inputType"
                            rules={{ required: "Cannot be empty" }}
                            render={({ field: { value, onChange }, fieldState: { error } }) => {
                                return (
                                    <Dropdown
                                        id="dropdown-question-type"
                                        options={options}
                                        onSelect={(value) => {
                                            onChange(value);
                                            if (value === "range") {
                                                setValue("min", 1);
                                                setValue("max", 10);
                                                unregister("option");
                                            } else if (["option", "checkbox", "radio"].includes(value)) {
                                                setValue("option", [{ label: "", value: "" }]);
                                                unregister("min");
                                                unregister("max");
                                                unregister("minLabel");
                                                unregister("maxLabel");
                                            } else {
                                                unregister("option");
                                                unregister("min");
                                                unregister("max");
                                                unregister("minLabel");
                                                unregister("maxLabel");
                                            }
                                        }}
                                        value={value}
                                        error={error}
                                        isDisabled={isFinal}
                                        isFloating
                                    />
                                );
                            }}
                        />
                    </Input>
                    <Input label={text("question_title")} error={errors.label} className={styles.input}>
                        <textarea
                            {...register("label", {
                                required: "Cannot be empty",
                            })}
                            placeholder="Enter a question"
                            rows={3}
                            disabled={isFinal}
                        />
                    </Input>
                    {getValues("inputType") === "range" && <Range register={register} getValues={getValues} setValue={setValue} errors={errors} />}
                    {["option", "radio", "checkbox"].includes(getValues("inputType")) && (
                        <Options
                            modal={modal}
                            isQuiz={surveyData.type === "quiz"}
                            text={text}
                            register={register}
                            getValues={getValues}
                            setValue={setValue}
                            errors={errors}
                            control={control}
                            isFinal={isFinal}
                        />
                    )}
                </div>
                <ButtonContainer className={styles.button}>
                    {modalData.label && surveyData.status !== "final" && (
                        <Button onClick={deleteHandler} isTransparent style={{ width: "fit-content", color: "#EE3124", borderColor: "#EE3124" }}>
                            {text("question_delete")}
                        </Button>
                    )}
                    <Button
                        onClick={async () => {
                            toast.dismiss();
                            await setModal(false);
                        }}
                        isTransparent
                        style={{ width: "7rem", marginLeft: "auto" }}
                    >
                        {text_common("cancel")}
                    </Button>
                    {!isFinal && (
                        <Button style={{ width: "7rem" }} isLoading={isLoading} isSubmit>
                            {text_common("save")}
                        </Button>
                    )}
                </ButtonContainer>
            </form>
        </ModalContainer>
    );
};

Modal.propTypes = {
    addData: PropTypes.func,
    updateData: PropTypes.func,
    deleteData: PropTypes.func,
    surveyData: PropTypes.object,
    text: PropTypes.func,
    text_common: PropTypes.func,
    isFinal: PropTypes.oneOf(["final", "draft"]),
};

export default Modal;
