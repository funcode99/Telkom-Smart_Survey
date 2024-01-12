import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import styles from "./Header.module.scss";

import { IoMenu } from "react-icons/io5";
import MainLogo from "../../public/images/logo/logo_blend.svg";
import MainLogoFill from "../../public/images/logo/logo_fill.svg";

import { Button, ButtonContainer } from "../global/Button";
import Language from "../global/Language";

const Header = ({ isResponsive, setOpen }) => {
    const [isTop, setTop] = useState(true);

    useEffect(() => {
        const onScroll = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                setTop(false);
            } else {
                setTop(true);
            }
        };

        window.addEventListener("scroll", onScroll);
        return function cleanup() {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <header
            className={styles.container + (isResponsive ? " " + styles.mobile : "")}
            style={{ background: !isTop && "#fff", boxShadow: !isTop && "0 2px 10px rgba(0,0,0,0.1)" }}
        >
            <div className={styles.header}>
                {isResponsive && <IoMenu onClick={() => setOpen(true)} className={styles.menu_button} style={{ color: !isTop && "#313466" }} />}
                <div className={styles.logo} style={{ color: !isTop && "#313466" }}>
                    {isTop ? <MainLogo /> : <MainLogoFill />}
                </div>
                <Language isReverse={!isTop} className={styles.language} isMini={isResponsive} />
                {!isResponsive && (
                    <ButtonContainer style={{ height: "2.25rem", flex: 0 }}>
                        <Link href="/register">
                            <a>
                                <Button style={{ width: "6.5rem" }}>SIGN UP</Button>
                            </a>
                        </Link>
                        <Link href="/login">
                            <a>
                                <Button style={{ width: "6.5rem", color: isTop && "#fff" }} isTransparent>
                                    LOGIN
                                </Button>
                            </a>
                        </Link>
                    </ButtonContainer>
                )}
            </div>
        </header>
    );
};

Header.propTypes = {
    isResponsive: PropTypes.bool,
    setOpen: PropTypes.func,
};

export default Header;
