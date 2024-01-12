import PropTypes from "prop-types";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import styles from "./QuestionCard.module.scss";

import DragIcon from "../../../public/images/survey/drag_icon.svg";
import { userProfile } from "../../../utils/recoil";
import { useRecoilValue } from "recoil";

import useModal from "../../../utils/useModal";

const Card = ({ index, data, provided, isDragging, isLoading, isHidden }) => {
    const { setData } = useModal("edit-question");
    const profile = useRecoilValue(userProfile);
    const { t } = useTranslation("edit-survey");

    const getInputName = (type) => {
        if (["input-text", "text"].includes(type)) {
            return t("type_text");
        } else if (["radio", "option"].includes(type)) {
            return t("type_option");
        } else if (["file", "file-image"].includes(type)) {
            return t("type_image");
        } else if (["checkbox"].includes(type)) {
            return t("checkbox");
        } else if (["range"].includes(type)) {
            return t("range");
        }
    };

    return (
        <div
            className={styles.container + (isDragging ? " " + styles.dragging : "")}
            onClick={() => {
                if (profile.level !== "super") {
                    setData({
                        index: index,
                        ...data,
                    });
                }
            }}
            ref={provided.innerRef}
            {...provided.draggableProps}
        >
            <div className={styles.index}>
                <div {...provided.dragHandleProps} style={{ cursor: isLoading && "wait", display: isHidden && "none" }}>
                    <DragIcon />
                </div>
                <span>{index + 1}</span>
            </div>
            <div className={styles.card}>
                <label className={styles.card_title}>{data.label}</label>
                <div className={styles.card_header}>
                    <span>{getInputName(data.inputType)}</span>
                </div>
                <div className={styles.card_option}>
                    {data.option?.map((option, index) => {
                        return (
                            <li key={index}>
                                <span className={styles.label}>
                                    {t("option_title")} {index + 1}
                                </span>
                                {option.label.includes("https://play.min.io/option/images/") ? (
                                    <Image className={styles.value} src={option.label} alt={option.value} />
                                ) : (
                                    <span className={styles.value}>{option.label}</span>
                                )}
                                {/* 
                                <span className={styles.label}>Value</span>
                                <span className={styles.value}>{option.value}</span> */}
                            </li>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

Card.propTypes = {
    index: PropTypes.number,
    data: PropTypes.shape({
        label: PropTypes.string,
        inputType: PropTypes.string,
        option: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                value: PropTypes.string,
            })
        ),
    }),
    provided: PropTypes.shape({
        innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.elementType })]),
        draggableProps: PropTypes.object,
        dragHandleProps: PropTypes.object,
    }),
    isDragging: PropTypes.bool,
    isLoading: PropTypes.bool,
    isHidden: PropTypes.bool,
};

export default Card;
