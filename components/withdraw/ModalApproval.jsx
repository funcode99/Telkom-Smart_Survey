import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import styles from "./Modal.module.scss";

import { MdClose } from "react-icons/md";
import { setStatusWithdraw } from "../../utils/api/withdrawApi";
import useModal from "../../utils/useModal";

import ModalContainer from "../modal/ModalContainer";
import Input from "../global/Input";
import { ButtonContainer, Button } from "../global/Button";

const ModalApproval = ({ text_common, refresh }) => {
    const [input, setInput] = useState({});
    const [approveLoading, setApproveLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);
    const { modal, data, setModal } = useModal("withdraw-approval");

    useEffect(() => {
        if (modal && data.withdrawalId) setInput(data);
    }, [modal]);

    const submitHandler = (status) => {
        const setLoading = status === "approved" ? setApproveLoading : setRejectLoading;
        setLoading(true);

        setStatusWithdraw({ status }, data.withdrawalId)
            .then(async (resolve) => {
                console.log(resolve);
                refresh();
                toast.info(`Verify voucher success`);
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
            isLoading={approveLoading || rejectLoading}
            customContainer={{ width: "28rem", overflowY: "visible" }}
            onClose={() => {
                setApproveLoading(false);
                setRejectLoading(false);
                setInput({});
            }}
        >
            <div className={styles.title}>
                <h5>Approval Withdraw</h5>
                <MdClose className={styles.close} onClick={() => setModal(false)} />
            </div>
            <Input value={input.withdrawalId} label="Withdraw ID" isDisabled />
            <Input value={input.user?.email || "-"} label="Email" isDisabled />
            <div className={styles.split}>
                <Input value={input.point} label="Point" isDisabled />
                <Input value={input.bank} label="Bank" isDisabled />
            </div>
            <Input value={input.accountNumber} label="Account Number" isDisabled />

            <ButtonContainer style={{ marginTop: "1rem" }}>
                <Button
                    style={{ flex: 1 }}
                    isLoading={rejectLoading}
                    isDisabled={approveLoading}
                    onClick={() => submitHandler("rejected")}
                    isTransparent
                >
                    {text_common("reject")}
                </Button>
                <Button style={{ flex: 1 }} isLoading={approveLoading} isDisabled={rejectLoading} onClick={() => submitHandler("approved")}>
                    {text_common("approve")}
                </Button>
            </ButtonContainer>
        </ModalContainer>
    );
};

ModalApproval.propTypes = {
    text: PropTypes.func,
    text_common: PropTypes.func,
    refresh: PropTypes.func,
};

export default ModalApproval;
