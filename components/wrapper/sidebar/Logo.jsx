import Link from "next/link";
import PropTypes from "prop-types";
import styles from "./Logo.module.scss";

import { MdClose } from "react-icons/md";
import MainLogo from "../../../public/images/logo/logo_fill.svg";

import Language from "../../global/Language";

const Logo = ({ isResponsive, close }) => {
    return (
        <div className={styles.container} style={{ justifyContent: isResponsive && "space-between" }}>
            <Link href="/home">
                <a>
                    <MainLogo alt="Kutanya.com" />
                </a>
            </Link>
            {isResponsive && (
                <div className={styles.mobile_menu}>
                    <Language className={styles.language} isReverse isMini />
                    <MdClose onClick={close} />
                </div>
            )}
        </div>
    );
};

Logo.propTypes = {
    isResponsive: PropTypes.bool,
    close: PropTypes.func,
};

export default Logo;
