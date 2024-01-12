import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";

import { createGroup } from "../../utils/api/groupApi";
import useModal from "../../utils/useModal";
import { userProfile } from "../../utils/recoil";
import { useRecoilState } from "recoil";

import ModalContainer from "../modal/ModalContainer";
import Input from "../global/Input";
import { ButtonContainer, Button } from "../global/Button";
import { ModalHeader as Header } from "../global/Header";

const ModalAdd = ({ refresh }) => {
    const [isLoading, setLoading] = useState(false);
    const [profile, setProfile] = useRecoilState(userProfile);
    const { modal, setModal } = useModal("create-group");
    const { t } = useTranslation("group");
    const { t: t_c } = useTranslation("common");
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const submitHandler = (input, e) => {
        e.preventDefault();
        setLoading(true);

        createGroup(input)
            .then((resolve) => {
                setProfile({ ...profile, groups: [...(profile.groups || []), resolve] });
                toast.info(t("success_create_group"));
                refresh();
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
            onClose={() => {
                reset({});
            }}
        >
            <form onSubmit={handleSubmit(submitHandler)}>
                <Header title={t("group_create")} />
                <Input
                    label={t("group_name")}
                    error={errors.groupName}
                    controller={register("groupName", {
                        required: t_c("error_required"),
                    })}
                />
                <Input
                    label={t("group_description")}
                    error={errors.groupDesc}
                    controller={register("groupDesc", {
                        required: t_c("error_required"),
                    })}
                />
                <ButtonContainer style={{ marginTop: "1.5rem" }}>
                    <Button onClick={() => setModal(false)} isTransparent>
                        {t_c("cancel")}
                    </Button>
                    <Button isLoading={isLoading} isSubmit>
                        {t_c("save")}
                    </Button>
                </ButtonContainer>
            </form>
        </ModalContainer>
    );
};

ModalAdd.propTypes = {
    refresh: PropTypes.func,
};

export default ModalAdd;
