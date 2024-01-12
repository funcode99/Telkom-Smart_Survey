import React, { useState } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { timeout } from "../../utils/functions";

import { getSurvey, createSurvey } from "../../utils/api/surveyApi";
import useModal from "../../utils/useModal";

import ModalContainer from "../modal/ModalContainer";
import ModalInput from "../modal/ModalInput";

const Modal = ({ isPaid }) => {
    const [isLoading, setLoading] = useState(false);
    const { modal, setModal, data } = useModal("use-template");
    const router = useRouter();

    const getSurveyDetail = async (surveyId) => {
        return new Promise((resolve, reject) => {
            getSurvey(surveyId)
                .then((response) => {
                    console.log(response);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    const createNewSurvey = async (data) => {
        return new Promise((resolve, reject) => {
            createSurvey({
                title: data.title,
                description: data.description,
                type: data.type,
                questions: data.questions?.map((question) => question._id),
            })
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    const importSurvey = async (e, surveyId) => {
        e.preventDefault();

        try {
            setLoading(true);
            const importData = await getSurveyDetail(surveyId);
            const result = await createNewSurvey(importData);
            await timeout(1000);
            setLoading(false);
            setModal(false);
            router.push("/edit-survey/" + result._id);
        } catch (error) {
            console.log(error);
            toast.error(error);
            setLoading(false);
        }
    };

    return (
        <ModalContainer show={modal} isLoading={isLoading}>
            <ModalInput
                title="Template Detail"
                isLoading={isLoading}
                onSubmit={(e) => importSurvey(e, data._id)}
                data={[
                    {
                        label: "Title",
                        value: data.title,
                        isDisabled: true,
                    },
                    {
                        label: "Description",
                        customInput: <textarea rows="3" value={data.description} disabled></textarea>,
                    },
                ]}
                button={[
                    {
                        label: "CLOSE",
                        onClick: () => {
                            setModal(false);
                        },
                        isTransparent: true,
                    },
                    {
                        label: isPaid ? "BUY TEMPLATE" : "USE TEMPLATE",
                        canDisabled: true,
                        canSubmit: true,
                    },
                ]}
            />
        </ModalContainer>
    );
};

Modal.propTypes = {
    isPaid: PropTypes.bool,
};

export default Modal;
