import PropTypes from "prop-types";
import { SpinnerCircular } from "spinners-react";
import styles from "./Spinner.module.scss";

const Spinner = ({ size = 150, thickness = 150, color = "#7b6ee3", secondaryColor = "rgba(0,0,0,0.1)", style }) => {
    return (
        <div className={styles.loader} style={style}>
            <SpinnerCircular color={color} secondaryColor={secondaryColor} size={size} thickness={thickness} />
        </div>
    );
};

Spinner.propTypes = {
    thickness: PropTypes.number,
    size: PropTypes.number,
    color: PropTypes.string,
    secondaryColor: PropTypes.string,
    style: PropTypes.object,
};

export default Spinner;
