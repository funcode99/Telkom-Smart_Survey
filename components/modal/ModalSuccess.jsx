import { useState } from "react";
import styles from "./ModalFeedback.module.scss";

import useModal from "../../utils/useModal";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { createFeedback } from "../../utils/api/feedbackApi";

import ModalContainer from "./ModalContainer";
import Input from "../global/Input";
import { ButtonContainer, Button } from "../global/Button";
import { toast } from "react-toastify";

const ModalFeedback = () => {
    const [input, setInput] = useState({ message: "", rating: 0 });
    const [isLoading, setLoading] = useState(false);
    const { modal, setModal } = useModal("send-feedback");

    const submitHandler = () => {
        setLoading(true);
        createFeedback(input)
            .then((resolve) => {
                console.log(resolve);
                toast.info("Send feedback success.");
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
        <ModalContainer
            show={modal}
            isLoading={isLoading}
            customContainer={{ padding: "1.5rem 1.875rem" }}
            onClose={() => {
                setInput({ message: "", rating: 0 });
            }}
        >
            <h5 className={styles.title}>Feedback</h5>
            <div className={styles.rating}>
                {Array.from({ length: 5 }, (_, index) => {
                    if (index + 1 <= input.rating) {
                        return <AiFillStar onClick={() => setInput({ ...input, rating: index + 1 })} key={index} />;
                    } else {
                        return <AiOutlineStar onClick={() => setInput({ ...input, rating: index + 1 })} key={index} />;
                    }
                })}
            </div>
            <Input label="Message">
                <textarea
                    className={styles.input}
                    rows={4}
                    placeholder="Fill in your feedback for us.."
                    value={input.message}
                    onChange={(e) => {
                        setInput({ ...input, message: e.target.value.substring(0, 250) });
                    }}
                />
            </Input>
            <p className={styles.info}>{input.message.length}/250 max characters</p>
            <ButtonContainer style={{ width: "24rem", gap: "1.5rem" }}>
                <Button style={{ flex: 1 }} isTransparent onClick={() => setModal(false)}>
                    Later
                </Button>
                <Button style={{ flex: 1 }} onClick={submitHandler} isDisabled={!input.rating} isLoading={isLoading}>
                    Send Feedback
                </Button>
            </ButtonContainer>
        </ModalContainer>
    );
};

export default ModalFeedback;
