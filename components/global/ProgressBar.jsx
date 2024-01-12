import PropTypes from "prop-types";
import styles from "./ProgressBar.module.scss";

const ProgressBar = ({ show, status, color }) => {
    return (
        <>
            {show ? <div className={styles.progressbar} style={{ backgroundColor: color || null }} /> : null}
            {status ? <div className={styles.statusbar}>{status}</div> : null}
        </>
    );
};

ProgressBar.propTypes = {
    show: PropTypes.bool,
    status: PropTypes.string,
    color: PropTypes.string,
};

export default ProgressBar;
