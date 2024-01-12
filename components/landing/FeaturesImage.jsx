import Image from "next/image";
import PropTypes from "prop-types";
import Fade from "react-reveal/Fade";
import styles from "./FeaturesImage.module.scss";

import Image1 from "../../public/images/landing/features_big_1.png";
import Image2 from "../../public/images/landing/features_big_2.png";

const FeaturesImage = ({ t, isResponsive }) => {
    return (
        <div className={styles.container + (isResponsive ? " " + styles.mobile : "")}>
            <div className={styles.body}>
                <Fade right>
                    <section className={styles.section}>
                        <div className={styles.image}>
                            <Image src={Image1.src} alt="know_your_customer" layout="fill" objectFit="contain" />
                        </div>
                        <div className={styles.text}>
                            <h3>{t("fi_content")}</h3>
                            <p>{t("fi_content_body")}</p>
                        </div>
                    </section>
                </Fade>
                <Fade left>
                    <section className={styles.section}>
                        <div className={styles.image}>
                            <Image src={Image2.src} alt="market_research" layout="fill" objectFit="contain" />
                        </div>
                        <div className={styles.text}>
                            <h3>{t("fi_text")}</h3>
                            <p>{t("fi_text_info")}</p>
                        </div>
                    </section>
                </Fade>
            </div>
        </div>
    );
};

FeaturesImage.propTypes = {
    isResponsive: PropTypes.bool,
    t: PropTypes.func,
};

export default FeaturesImage;
