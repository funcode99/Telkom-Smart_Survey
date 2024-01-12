import PropTypes from "prop-types";
import styles from "./Description.module.scss";

const Description = ({ t }) => {
    return (
        <div className={styles.container}>
            <div className={styles.body}>
                <h2>{t("description_header")}</h2>
                <div />
                <p>{t("description_body")}</p>
            </div>
        </div>
    );
};

Description.propTypes = {
    t: PropTypes.func,
};

export default Description;
