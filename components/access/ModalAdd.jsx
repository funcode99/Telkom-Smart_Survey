import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import useModal from "../../utils/useModal";
import ModalContainer from "../modal/ModalContainer";
import ModalInput from "../modal/ModalInput";
import { createAccess } from "../../utils/api/accessApi";

const ModalAdd = ({ refresh }) => {
    const [input, setInput] = useState({ accessName: "" });
    const [isLoading, setLoading] = useState(false);
    const { modal, setModal } = useModal("add-access");

    const saveHandler = (e) => {
        e.preventDefault();
        setLoading(true);

        createAccess(input)
            .then(() => {
                setInput({});
                toast.info("Create access success");
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
                title="Add Access"
                isLoading={isLoading}
                data={[
                    {
                        label: "Access Name",
                        value: input.accessName,
                        onChange: (e) => {
                            setInput({ ...input, accessName: e.target.value });
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
};

export default ModalAdd;
