import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./Merchant.module.scss";

import useModal from "../../utils/useModal";
import PendingLogo from "../../public/images/merchant/pending_logo.png";

import { Button } from "../global/Button";
import ModalMerchantCreate from "./ModalMerchantCreate";

const MerchantNew = ({ onSuccess }) => {
    const { setModal } = useModal("create-merchant");

    return (
        <div className={styles.container}>
            <LazyLoadImage src={PendingLogo.src} />
            <Button onClick={() => setModal(true)}>Daftar sebagai Merchant</Button>
            <ModalMerchantCreate onSuccess={onSuccess} />
        </div>
    );
};

MerchantNew.propTypes = {
    onSuccess: PropTypes.func,
};

export default MerchantNew;
