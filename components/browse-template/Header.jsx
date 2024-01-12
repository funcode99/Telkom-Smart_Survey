import PropTypes from "prop-types";
import styles from "./Header.module.scss";

const Header = ({ type, setType, isLoading }) => {
    return (
        <div className={styles.container}>
            <button className={styles.card + (type === "share" ? " " + styles.active : "")} onClick={() => setType("share")} disabled={isLoading}>
                <label>Free Template</label>
            </button>
            <button className={styles.card + (type === "sell" ? " " + styles.active : "")} onClick={() => setType("sell")} disabled={isLoading}>
                <label>Paid Template</label>
            </button>
        </div>
    );
};

Header.propTypes = {
    type: PropTypes.oneOf(["share", "sell"]),
    setType: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default Header;
