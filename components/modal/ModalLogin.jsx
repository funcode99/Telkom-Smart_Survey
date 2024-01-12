import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./ModalLogin.module.scss";

import { MdClose } from "react-icons/md";
import useModal from "../../utils/useModal";

import ModalContainer from "./ModalContainer";
import LoginForm from "../login/LoginForm";
import Input from "../global/Input";
import { ButtonContainer, Button } from "../global/Button";

const ModalLogin = ({ popupSuccess, isAnonymous }) => {
    const [isLoading, setLoading] = useState(false);
    const [isCustom, setCustom] = useState(false);
    const { modal, setModal } = useModal("popup-login");

    const Anonymous = () => {
        const [input, setInput] = useState({ name: "" });

        return (
            <form
                onSubmit={() => {
                    setModal(false);
                    popupSuccess(input);
                }}
            >
                <Input label="Name" value={input.name} onChange={(e) => setInput({ ...input, name: e.target.value })} isRequired />
                <ButtonContainer style={{ height: "2.4rem", marginTop: "1.5rem" }}>
                    <Button type="button" isTransparent onClick={() => setCustom(false)}>
                        CANCEL
                    </Button>
                    <Button>OK</Button>
                </ButtonContainer>
            </form>
        );
    };

    return (
        <ModalContainer show={modal} isLoading={isLoading} customContainer={{ overflow: "visible" }} NextComponent={isCustom && Anonymous}>
            <LoginForm
                isLoading={isLoading}
                setLoading={setLoading}
                isPopup
                popupSuccess={() => {
                    setModal(false);
                    popupSuccess();
                }}
            />
            {isAnonymous && (
                <div className={styles.anonymous}>
                    <button onClick={() => setCustom(true)}>Use Guest Account</button>
                </div>
            )}
            <button onClick={() => setModal(false)} className={styles.close}>
                <MdClose />
            </button>
        </ModalContainer>
    );
};

ModalLogin.propTypes = {
    popupSuccess: PropTypes.func,
    isAnonymous: PropTypes.bool,
};

export default ModalLogin;
