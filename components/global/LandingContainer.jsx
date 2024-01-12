import PropTypes from "prop-types";
import styles from "./LandingContainer.module.scss";

import Icon from "../../public/images/main_logo.svg";
import ProgressBar from "./ProgressBar";

const LandingContainer = ({ children, isLoading, style }) => {
    return (
        <div className={styles.page_container}>
            <ProgressBar show={isLoading} />
            <div className={styles.background} />
            <div className={styles.content_container} style={style}>
                <main>
                    <div className={styles.icon}>
                        <Icon />
                        <div>
                            <b>Smart </b>Survey
                        </div>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
};

LandingContainer.propTypes = {
    children: PropTypes.node,
    isLoading: PropTypes.bool,
    style: PropTypes.object,
};

export default LandingContainer;
