import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./Merchant.module.scss";

import PendingLogo from "../../public/images/merchant/pending_logo.png";

const MerchantNew = () => {
    return (
        <div className={styles.container}>
            <LazyLoadImage src={PendingLogo.src} />
            <h5 className={styles.title}>Pendaftaran Sedang Diproses</h5>
            <p className={styles.message}>Silakan tunggu hingga proses verifikasi selesai maksimal 2 hari</p>
        </div>
    );
};

export default MerchantNew;
