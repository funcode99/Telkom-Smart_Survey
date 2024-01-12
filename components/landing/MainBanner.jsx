import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./MainBanner.module.scss";

import MainImage from "../../public/images/landing/main_image.png";

import { Button } from "../global/Button";

const MainBanner = ({ elementRef, t }) => {
    const scrollHandler = () => {
        const elementPosition = elementRef.current?.getBoundingClientRect().top;
        const offsetPosition = elementPosition - 86;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.body_container}>
                <div className={styles.body}>
                    <div className={styles.text}>
                        <h1>{t("main_banner_content")}</h1>
                        <Button style={{ height: "2.75rem", width: "fit-content", padding: "0 1.875rem" }} onClick={scrollHandler}>
                            {t("main_banner_text")}
                        </Button>
                    </div>
                    <div className={styles.image}>
                        <LazyLoadImage src={MainImage.src} alt="main_image" />
                    </div>
                </div>
            </div>
        </div>
    );
};

MainBanner.propTypes = {
    elementRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.elementType })]),
    isResponsive: PropTypes.bool,
    t: PropTypes.func,
};

export default MainBanner;
