import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./Features.module.scss";

import Icon1 from "../../public/images/landing/features_1.png";
import Icon2 from "../../public/images/landing/features_2.png";
import Icon3 from "../../public/images/landing/features_3.png";
import Icon4 from "../../public/images/landing/features_4.png";

const Features = ({ t }) => {
    return (
        <div className={styles.container}>
            <div className={styles.body}>
                <h2>{t("feature_title")}</h2>
                <div className={styles.card_container}>
                    <div className={styles.card}>
                        <LazyLoadImage src={Icon1.src} alt="survey_template" />
                        <label>{t("feature_survey_template")}</label>
                    </div>
                    <div className={styles.card}>
                        <LazyLoadImage src={Icon2.src} alt="skip_login" />
                        <label>{t("feature_skip_login")}</label>
                    </div>
                    <div className={styles.card}>
                        <LazyLoadImage src={Icon3.src} alt="custom_form" />
                        <label>{t("feature_custom_form")}</label>
                    </div>
                    <div className={styles.card}>
                        <LazyLoadImage src={Icon4.src} alt="visual_dashboard" />
                        <label>{t("feature_visual_dashboard")}</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

Features.propTypes = {
    t: PropTypes.func,
};

export default Features;
