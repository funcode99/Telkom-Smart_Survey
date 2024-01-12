import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Controller, useFieldArray } from "react-hook-form";
import styles from "./Options.module.scss";

import { uploadFile, timeout } from "../../../utils/functions";
import { HiOutlineTrash } from "react-icons/hi";
import { BsCheck } from "react-icons/bs";
import AddImageIcon from "../../../public/images/add_image.svg";

// import Tooltip from "../../global/Tooltip";
import Input from "../../global/Input";

const Options = ({ text, isQuiz, register, getValues, setValue, control, errors, isFinal }) => {
    const [height, setHeight] = useState(null);
    const containerRef = useRef();
    const { fields, append, remove, swap } = useFieldArray({
        control,
        name: "option",
    });

    const uploadHandler = async (index) => {
        if (isFinal) return;

        const image = await uploadFile();
        if (image.error) return toast.error(image.error);
        setValue(`option.${index}.optionImage`, image.data);
    };

    useEffect(() => {
        if (fields.length) setHeight(containerRef.current?.offsetHeight);
    }, [fields, containerRef.current]);

    const addHandler = async () => {
        setHeight(null);
        append({ label: "", value: "" });
        await timeout(100);
        setHeight(containerRef.current?.offsetHeight);
    };

    const deleteHandler = async (index) => {
        setHeight(null);
        remove(index);
        await timeout(100);
        setHeight(containerRef.current?.offsetHeight);
    };

    return (
        <Input label={text("option_title")}>
            <DragDropContext
                onDragEnd={({ source, destination }) => {
                    if (destination) swap(source.index, destination.index);
                }}
            >
                <Droppable droppableId="drop-option">
                    {(provided) => (
                        <div ref={containerRef} onLoad={() => setHeight(containerRef.current?.offsetHeight)} style={{ height }}>
                            <div className={styles.container} {...provided.droppableProps} ref={provided.innerRef}>
                                {fields.map((option, index) => {
                                    return (
                                        <Draggable key={"option" + index} draggableId={"option" + index} index={index} isDragDisabled={isFinal}>
                                            {(provided) => (
                                                <section
                                                    className={styles.card_container}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <div className={styles.left_container}>
                                                        <Input
                                                            label={text("option_title") + " " + (index + 1)}
                                                            controller={register(`option.${index}.label`, {
                                                                required: "Cannot be empty",
                                                                onChange: (e) => {
                                                                    setValue(`option.${index}.value`, e.target.value);
                                                                },
                                                            })}
                                                            isDisabled={isFinal}
                                                            error={errors.option?.[index]?.label}
                                                        />
                                                        <div className={styles.input_optional}>
                                                            {isQuiz ? (
                                                                <Controller
                                                                    control={control}
                                                                    name={`option.${index}.point`}
                                                                    render={({ field: { value, onChange } }) => {
                                                                        return (
                                                                            <button
                                                                                className={styles.input_check}
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    if (isFinal) return;
                                                                                    onChange(value >= 100 ? 0 : 100);
                                                                                }}
                                                                                style={{ cursor: isFinal && "default" }}
                                                                            >
                                                                                <div className={value >= 100 ? styles.checked : null}>
                                                                                    <BsCheck style={{ cursor: isFinal && "default" }} />
                                                                                </div>
                                                                                <span>{text("option_correct")}</span>
                                                                            </button>
                                                                        );
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Input
                                                                    label={text("option_skip")}
                                                                    controller={register(`option.${index}.skipTo`, { required: false })}
                                                                    isDisabled={isFinal}
                                                                    type="number"
                                                                />
                                                            )}
                                                            {getValues("option")?.length === index + 1 && (
                                                                <Controller
                                                                    control={control}
                                                                    name={`option.${index}.isCustom`}
                                                                    render={({ field: { value, onChange } }) => {
                                                                        return (
                                                                            <button
                                                                                className={styles.input_check}
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    if (isFinal) return;

                                                                                    onChange(!value);
                                                                                    setValue(`option.${index}`, {
                                                                                        ...getValues("option")[index],
                                                                                        label: text("option_other"),
                                                                                        value: text("option_other"),
                                                                                    });
                                                                                }}
                                                                                style={{ cursor: isFinal && "default" }}
                                                                            >
                                                                                <div className={value ? styles.checked : null}>
                                                                                    <BsCheck style={{ cursor: isFinal && "default" }} />
                                                                                </div>
                                                                                <span>{text("option_custom")}</span>
                                                                            </button>
                                                                        );
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className={styles.right_container}>
                                                        {getValues("option")?.length > 1 && !isFinal ? (
                                                            <HiOutlineTrash onClick={() => deleteHandler(index)} className={styles.close_button} />
                                                        ) : null}
                                                        <div className={styles.image_container} style={{ borderWidth: !option.optionImage && 0 }}>
                                                            {option.optionImage ? (
                                                                <>
                                                                    <Image
                                                                        alt="image"
                                                                        src={
                                                                            option.optionImage.includes("https://")
                                                                                ? option.optionImage
                                                                                : `data:image/jpeg;base64,${option.optionImage}`
                                                                        }
                                                                        layout="fill"
                                                                        objectFit="cover"
                                                                    />
                                                                    {!isFinal && (
                                                                        <div
                                                                            className={styles.delete_image}
                                                                            onClick={() => setValue(`option.${index}.optionImage`, "")}
                                                                        >
                                                                            <HiOutlineTrash />
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <AddImageIcon
                                                                    className={styles.add_image_button}
                                                                    onClick={() => uploadHandler(index)}
                                                                    style={{ cursor: isFinal && "default" }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                    {provided.placeholder}
                                                </section>
                                            )}
                                        </Draggable>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            {!isFinal && (
                <span className={styles.add} onClick={addHandler}>
                    {"+ " + text("option_add")}
                </span>
            )}
        </Input>
    );
};

Options.propTypes = {
    register: PropTypes.func,
    getValues: PropTypes.func,
    setValue: PropTypes.func,
    control: PropTypes.func,
    watch: PropTypes.func,
    errors: PropTypes.object,
    text: PropTypes.func,
    isQuiz: PropTypes.bool,
    isFinal: PropTypes.bool,
};

export default Options;
