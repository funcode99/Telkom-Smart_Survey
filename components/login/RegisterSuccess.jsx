import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import styles from "./Success.module.scss";

import SuccessIcon from "../../public/images/global/success.png";

import { Button } from "../global/Button";

const RegisterSuccess = ({ t }) => {
    return (
        <div className={styles.container}>
            <h3>{t("success_register")}</h3>
            <Image src={SuccessIcon.src} alt="success" width={120} height={120} />
            <Button style={{ width: "100%" }}>
                <Link href="/login">LOGIN</Link>
            </Button>
        </div>
    );
};

RegisterSuccess.propTypes = {
    t: PropTypes.func,
};

export default RegisterSuccess;
