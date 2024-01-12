import PropTypes from "prop-types";
import Image from "next/image";
import styles from "./Success.module.scss";

import MailIcon from "../../public/images/global/mail.png";

// import { Button } from "../global/Button";

const OtpSuccess = ({ t }) => {
    return (
        <div className={styles.container}>
            <h3>{t("success_otp")}</h3>
            <Image src={MailIcon.src} alt="success" width={100} height={94} />
            <p>{t("success_otp_desc")}</p>
        </div>
    );
};

OtpSuccess.propTypes = {
    t: PropTypes.func,
};

export default OtpSuccess;
