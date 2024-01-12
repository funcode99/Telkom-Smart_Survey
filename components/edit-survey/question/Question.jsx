import { useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import styles from "./Question.module.scss";

import NotFoundIcon from "../../../public/images/survey/question_not_found_icon.svg";
import { setNumOfSort } from "../../../utils/api/surveyApi";

import Card from "./QuestionCard";
import Spinner from "../../global/Spinner";

const Question = ({ survey, list, setList, isLoading }) => {
    const [sortLoading, setSortLoading] = useState(false);
    const router = useRouter();
    const { t } = useTranslation("edit-survey");

    const dragHandler = ({ draggableId, source, destination }) => {
        if (!destination || source.index === destination.index) return;

        const oldList = [...list];
        const newList = [...list];
        newList.splice(source.index, 1);
        newList.splice(destination.index, 0, list[source.index]);
        setList(newList);

        setSortLoading(true);
        setNumOfSort({ questionId: draggableId, numOfSort: destination.index + 1 }, router.query.surveyId)
            .then((resolve) => {
                console.log(resolve);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
                setList(oldList);
            })
            .finally(() => {
                setSortLoading(false);
            });
    };

    if (isLoading) return <Spinner />;
    if (!list.length)
        return (
            <div className={styles.empty_container}>
                <NotFoundIcon />
                <label>{t("empty_question_title")}</label>
                <p>{t("empty_question_message")}</p>
            </div>
        );

    return (
        <DragDropContext onDragEnd={dragHandler}>
            <Droppable droppableId="drop-question">
                {(provided) => (
                    <div className={styles.container} {...provided.droppableProps} ref={provided.innerRef}>
                        {list.map((data, index) => {
                            return (
                                <Draggable
                                    key={data._id}
                                    draggableId={data._id}
                                    index={index}
                                    isDragDisabled={sortLoading || survey.status === "final"}
                                >
                                    {(provided, snapshot) => (
                                        <Card
                                            data={data}
                                            index={index}
                                            provided={provided}
                                            questionList={list}
                                            isDragging={snapshot.isDragging}
                                            isLoading={sortLoading}
                                            isHidden={survey.status === "final"}
                                        />
                                    )}
                                </Draggable>
                            );
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

Question.propTypes = {
    survey: PropTypes.shape({
        status: PropTypes.oneOf(["final", "draft", "notActive"]),
    }),
    list: PropTypes.array,
    setList: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default Question;
