import PropTypes from "prop-types";
import styles from "./Header.module.scss";

import { IoMenu } from "react-icons/io5";

import Language from "../../global/Language";
import Searchbox from "./Searchbox";
import Notification from "./Notification";
import Subscription from "./Subscription";

const Header = ({ isResponsive, toggleClick }) => {
    if (isResponsive) {
        return (
            <div className={styles.container} style={{ height: "3.5rem", padding: "0 1rem", gap: "0.5625rem" }}>
                {isResponsive && (
                    <div onClick={toggleClick} className={styles.toggle_button}>
                        <IoMenu />
                    </div>
                )}
                <Searchbox isResponsive />
                <Notification isResponsive />
                <Subscription isResponsive />
            </div>
        );
    } else {
        return (
            <div className={styles.container}>
                <Searchbox />
                <Subscription />
                <Language />
                <Notification />
            </div>
        );
    }
};

Header.propTypes = {
    isResponsive: PropTypes.bool,
    toggleClick: PropTypes.func,
};

export default Header;
