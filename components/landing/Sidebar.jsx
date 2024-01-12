import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import styles from "./Sidebar.module.scss";

import MainLogo from "../../public/images/logo/logo_fill.svg";
import { MdClose } from "react-icons/md";

import { Button } from "../global/Button";

const Sidebar = ({ isOpen, setOpen }) => {
    const { t } = useTranslation("login");

    return (
        <>
            {isOpen && <div className={styles.overlay} onClick={() => setOpen(false)} />}
            <div className={styles.container} style={{ left: isOpen && 0 }}>
                <div className={styles.logo}>
                    <MainLogo />
                    <MdClose onClick={() => setOpen(false)} className={styles.close} />
                </div>
                <div className={styles.body}>
                    <Link href="/login">
                        <a>
                            <Button>{t("login_title")}</Button>
                        </a>
                    </Link>
                    <Link href="/register">
                        <a>
                            <Button isTransparent>{t("register_title")}</Button>
                        </a>
                    </Link>
                </div>
            </div>
        </>
    );
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool,
    setOpen: PropTypes.func,
};

export default Sidebar;
