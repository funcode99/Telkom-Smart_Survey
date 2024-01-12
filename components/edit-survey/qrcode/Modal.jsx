import useModal from "../../../utils/useModal";

import ModalContainer from "../../modal/ModalContainer";

const Modal = () => {
    const { modal, setModal } = useModal("download-qrcode");

    return <ModalContainer show={modal}></ModalContainer>;
};

export default Modal