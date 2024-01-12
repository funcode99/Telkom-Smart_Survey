import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import useModal from "../../utils/useModal";
import { registerUser } from "../../utils/api/userApi";

import ModalContainer from "./ModalContainer";
import ModalInput from "./ModalInput";

const ModalAdd = ({ onSuccess, isAdmin }) => {
    const [input, setInput] = useState({ fullname: "", email: "", mobile: "", roleId: "", password: "", repassword: "" });
    const [isLoading, setLoading] = useState(false);
    const { modal, setModal } = useModal("add-user");

    const saveHandler = (e) => {
        e.preventDefault();

        if (input.password !== input.repassword) return toast.error("Re-type Password tidak cocok!");
        const newInput = { ...input, level: isAdmin ? "admin" : "user", is_active_full: true, roleId: process.env.NEXT_PUBLIC_ROLE_USER_BASIC };
        delete newInput.repassword;
        if (!input.mobile) delete newInput.mobile;
        setLoading(true);

        registerUser({ users: [newInput] })
            .then(() => {
                setInput({});
                toast.info("Register user success");
                onSuccess();
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
                title={`Add ${isAdmin ? "Admin" : "User"}`}
                isLoading={isLoading}
                onSubmit={(e) => saveHandler(e)}
                data={[
                    {
                        label: "Name",
                        value: input.fullname,
                        isRequired: true,
                        onChange: (e) => {
                            setInput({ ...input, fullname: e.target.value });
                        },
                    },
                    {
                        label: "Email",
                        value: input.email,
                        isRequired: true,
                        onChange: (e) => {
                            setInput({ ...input, email: e.target.value });
                        },
                    },
                    {
                        label: "Mobile",
                        value: input.mobile,
                        onChange: (e) => {
                            setInput({ ...input, mobile: e.target.value });
                        },
                    },
                    {
                        label: "Password",
                        value: input.password,
                        isRequired: true,
                        type: "password",
                        onChange: (e) => {
                            setInput({ ...input, password: e.target.value });
                        },
                    },
                    {
                        label: "Re-type Password",
                        value: input.repassword,
                        isRequired: true,
                        type: "password",
                        onChange: (e) => {
                            setInput({ ...input, repassword: e.target.value });
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
                        isTransparent: true,
                    },
                    {
                        label: "SAVE",
                        onClick: () => null,
                        canSubmit: true,
                        canDisabled: true,
                    },
                ]}
            />
        </ModalContainer>
    );
};

ModalAdd.propTypes = {
    onSuccess: PropTypes.func,
    isAdmin: PropTypes.bool,
};

export default ModalAdd;
