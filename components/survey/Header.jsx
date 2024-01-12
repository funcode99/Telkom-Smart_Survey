import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Image from "next/image";
import styles from "./Header.module.scss";

import MainLogo from "../../public/images/logo/logo_white.svg";
import { IoIosArrowDown } from "react-icons/io";
import { userProfile } from "../../utils/recoil";
import { useRecoilValue } from "recoil";

const Header = ({ anonymous = {}, redirect }) => {
    const profile = useRecoilValue(userProfile);
    const panelRef = useRef();
    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <Link href="/">
                    <a>
                        <MainLogo />
                    </a>
                </Link>
            </div>
            <div className={styles.profile}>
                {profile.profilePicture && (
                    <div className={styles.image}>
                        <Image src={profile.profilePicture} alt="photo" layout="fill" />
                    </div>
                )}
                <div className={styles.info}>
                    <div className={styles.name}>{anonymous.name || profile.fullname}</div>
                    <div className={styles.email}>{anonymous.email || profile.email}</div>
                </div>
                {anonymous.name || profile.fullname ? (
                    <div className={styles.arrow}>
                        <button
                            onClick={() => {
                                if (panelRef.current.style.display) {
                                    panelRef.current.style.display = null;
                                } else {
                                    panelRef.current.style.display = "block";
                                }
                            }}
                        >
                            <IoIosArrowDown />
                        </button>
                        <div
                            className={styles.panel}
                            ref={panelRef}
                            onClick={() => {
                                if (window !== "undefined") {
                                    window.localStorage.removeItem("token");
                                    window.localStorage.removeItem("refreshToken");
                                    if (redirect) router.replace("/login");
                                    else window.location.reload();
                                }
                            }}
                        >
                            {anonymous.name ? "Change user" : "Logout"}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

Header.propTypes = {
    anonymous: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
    }),
    redirect: PropTypes.bool,
};

export default Header;
