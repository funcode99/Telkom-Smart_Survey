import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import useModal from "../../utils/useModal";
import { updateRole } from "../../utils/api/roleApi";

import ModalContainer from "../modal/ModalContainer";
import ModalInput from "../modal/ModalInput";

const Modal = ({ refresh, isAdmin }) => {
    const [input, setInput] = useState({ name: "", key: "" });
    const [isLoading, setLoading] = useState(false);
    const { modal, setModal, data } = useModal("edit-role");

    useEffect(() => {
        if (data.roleId) {
            setInput({
                name: data.name || "",
                key: data.key || "",
            });
        }
    }, [data]);

    const saveHandler = (e) => {
        e.preventDefault();
        setLoading(true);

        updateRole(input, data.roleId)
            .then(() => {
                setInput({});
                toast.info("Update role success");
                refresh();
                setModal(false);
                setLoading(false);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
                setLoading(false);
            });
    };

    return (
        <ModalContainer show={modal} isLoading={isLoading}>
            <ModalInput
                title={`Edit Role${isAdmin ? " Admin" : ""}`}
                isLoading={isLoading}
                data={[
                    {
                        label: "Name",
                        value: input.name,
                        onChange: (e) => {
                            setInput({ ...input, name: e.target.value });
                        },
                    },
                    {
                        label: "Key",
                        value: input.key,
                        onChange: (e) => {
                            setInput({ ...input, key: e.target.value });
                        },
                    },
                ]}
                button={[
                    {
                        label: "CLOSE",
                        onClick: async () => {
                            await setModal(false);
                            setInput({});
                        },
                    },
                    {
                        label: "SAVE",
                        onClick: (e) => saveHandler(e),
                        canDisabled: true,
                    },
                ]}
            />
        </ModalContainer>
    );
};

Modal.propTypes = {
    refresh: PropTypes.func,
    isAdmin: PropTypes.bool,
};

export default Modal;
