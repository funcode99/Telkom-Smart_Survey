// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import useModal from "../../utils/useModal";
import ModalContainer from "../modal/ModalContainer";
import ModalInput from "../modal/ModalInput";

const Modal = () => {
    const { modal, setModal, data } = useModal("edit-user");

    return (
        <ModalContainer show={modal}>
            <ModalInput
                title="User Detail"
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
                        onClick: async () => {
                            await setModal(false);
                        },
                    },
                ]}
            />
        </ModalContainer>
    );
};

// Modal.propTypes = {
//     identifier: PropTypes.string,
//     isAdmin: PropTypes.bool,
// };

export default Modal;
