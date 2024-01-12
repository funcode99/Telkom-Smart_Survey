import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import styles from "./Tooltip.module.scss";

import { BsQuestionCircle } from "react-icons/bs";

const Tooltip = ({ message, position = "top", id = "guide", size, style }) => {
    return (
        <div style={style}>
            <BsQuestionCircle
                data-tip={message}
                data-place={position}
                data-for={id}
                style={{ color: "#B2B4B5", cursor: "help", width: size, height: size }}
            />
            <ReactTooltip id={id} className={styles.tooltip} globalEventOff="click" />
        </div>
    );
};

Tooltip.propTypes = {
    message: PropTypes.string,
    position: PropTypes.oneOf(["top", "bottom", "left", "right"]),
    id: PropTypes.string,
    size: PropTypes.number,
    style: PropTypes.object,
};

export default Tooltip;
