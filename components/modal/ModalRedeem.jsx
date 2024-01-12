import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./ModalRedeem.module.scss";

import useModal from "../../utils/useModal";
import { redeemVoucher } from "../../utils/api/voucherApi";

import ModalContainer from "./ModalContainer";
import Input from "../global/Input";
import { ButtonContainer, Button } from "../global/Button";
import { toast } from "react-toastify";

const ModalRedeem = ({ text }) => {
    const [input, setInput] = useState("");
    const [isLoading, setLoading] = useState(false);
    const { modal, setModal } = useModal("redeem-voucher");

    const submitHandler = () => {
        setLoading(true);
        redeemVoucher({ reedemCode: input })
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
        <ModalContainer show={modal} isLoading={isLoading} customContainer={{ padding: "1.5rem 1.875rem" }} onClose={() => setInput("")}>
            <h5 className={styles.title}>{text("redeem_title")}</h5>
            <Input
                label="Voucher Code"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                className={styles.input}
                placeholder="Type the voucher code"
            />
            <ButtonContainer style={{ gap: "1.5rem", justifyContent: "flex-end" }}>
                <Button isTransparent onClick={() => setModal(false)}>
                    CANCEL
                </Button>
                <Button onClick={submitHandler} isDisabled={!input} isLoading={isLoading}>
                    REDEEM
                </Button>
            </ButtonContainer>
        </ModalContainer>
    );
};

ModalRedeem.propTypes = {
    text: PropTypes.func,
};

export default ModalRedeem;
