import Image from "next/image";
import PropTypes from "prop-types";
import Link from "next/link";
import styles from "./Avatar.module.scss";

import { useRecoilValue } from "recoil";
import { userProfile } from "../../../utils/recoil";
import PremiumIcon from "../../../public/images/sidebar/premium_icon.svg";

const Avatar = ({ t, isResponsive }) => {
    const profile = useRecoilValue(userProfile);

    return (
        <div className={styles.container + (isResponsive ? " " + styles.mobile : "")} style={{ flexDirection: isResponsive && "row" }}>
            <div className={styles.image}>
                {profile.profilePicture ? (
                    <div className={styles.avatar_image}>
                        <Image alt="avatar" src={profile.profilePicture} layout="fill" />
                    </div>
                ) : (
                    <div className={styles.avatar_letter}>
                        {profile.fullname
                            .split(" ")
                            .filter((_, index) => index < 1)
                            .map((char) => char[0])
                            .join("")}
                    </div>
                )}
                {profile.subscription?._id && (
                    <div className={styles.premium_badge}>
                        <PremiumIcon width={20} height={20} />
                    </div>
                )}
            </div>
            <div className={styles.text}>
                <span>{t("welcome")}</span>
                <Link href="/profile">
                    <a>
                        <h5>{profile.fullname}</h5>
                    </a>
                </Link>
            </div>
        </div>
    );
};

Avatar.propTypes = {
    t: PropTypes.func,
    isResponsive: PropTypes.bool,
};

export default Avatar;
