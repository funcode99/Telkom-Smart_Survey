import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import { createRole } from "../../utils/api/roleApi";
import useModal from "../../utils/useModal";

import ModalContainer from "../modal/ModalContainer";
import ModalInput from "../modal/ModalInput";

const ModalAdd = ({ refresh, isAdmin }) => {
    const [input, setInput] = useState({ name: "", key: "" });
    const [isLoading, setLoading] = useState(false);
    const { modal, setModal } = useModal("add-role");

    const saveHandler = (e) => {
        e.preventDefault();
        setLoading(true);

        createRole({ ...input, level: isAdmin ? "admin" : "user" })
            .then(() => {
                setInput({});
                toast.info("Create role success");
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
                title={`Add Role${isAdmin ? " Admin" : ""}`}
                isLoading={isLoading}
                data={[
                    {
                        label: "Role Name",
                        value: input.name,
                        onChange: (e) => {
                            setInput({ ...input, name: e.target.value });
                        },
                    },
                    {
                        label: "Role Key",
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

ModalAdd.propTypes = {
    refresh: PropTypes.func,
    isAdmin: PropTypes.bool,
};

export default ModalAdd;
