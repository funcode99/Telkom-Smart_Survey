import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import { verifyUser } from "../../utils/api/userApi";

import useModal from "../../utils/useModal";
import ModalContainer from "../modal/ModalContainer";
import ModalInput from "../modal/ModalInput";

const ModalPending = ({ onSuccess }) => {
    const { modal, setModal, data } = useModal("verify-user");
    const [isLoading, setLoading] = useState(false);

    const saveHandler = () => {
        setLoading(true);

        verifyUser(data.userId)
            .then(() => {
                onSuccess();
                toast.info(`Verify admin success`);
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
        <ModalContainer show={modal} isLoading={isLoading}>
            <ModalInput
                title="Admin Detail"
                data={[
                    {
                        label: "Name",
                        value: data.fullname,
                        isDisabled: true,
                    },
                    {
                        label: "Email",
                        value: data.email,
                        isDisabled: true,
                    },
                    {
                        label: "Mobile",
                        value: data.mobile,
                        isDisabled: true,
                    },
                    {
                        label: "Role",
                        value: data.role_details?.name,
                        isDisabled: true,
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
                        label: "VERIFY",
                        onClick: () => {
                            saveHandler();
                        },
                    },
                ]}
            />
        </ModalContainer>
    );
};

ModalPending.propTypes = {
    onSuccess: PropTypes.func,
};

export default ModalPending;
