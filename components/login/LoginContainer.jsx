import PropTypes from "prop-types";
import { useRouter } from "next/router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./LoginContainer.module.scss";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
SwiperCore.use([Navigation, Pagination, Autoplay]);

import Banner1 from "../../public/images/login/banner_1.png";
import Banner2 from "../../public/images/login/banner_2.png";
import Banner3 from "../../public/images/login/banner_3.png";
import Banner4 from "../../public/images/login/banner_4.png";
import Banner5 from "../../public/images/login/banner_5.png";
import MainLogo from "../../public/images/login/main_logo.svg";
import ProgressBar from "../global/ProgressBar";
import Language from "../global/Language";

const LandingContainer = ({ children, description, isLoading, isCenter, style }) => {
    const router = useRouter();

    return (
        <div className={styles.page_container}>
            <ProgressBar show={isLoading} />
            <div className={styles.background}>
                {/* <Language className={styles.language} /> */}
                <Swiper
                    navigation={true}
                    loop={true}
                    autoplay={{ delay: 3000 }}
                    pagination={{ clickable: true }}
                    className={styles.slideshow_container}
                >
                    <SwiperSlide>
                        <div className={styles.slideshow}>
                            <h2>Survey Template Market</h2>
                            <p>{description[0]}</p>
                            <LazyLoadImage src={Banner1.src} visibleByDefault />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className={styles.slideshow}>
                            <h2>Customizable Form</h2>
                            <p>{description[1]}</p>
                            <LazyLoadImage src={Banner2.src} visibleByDefault />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className={styles.slideshow}>
                            <h2>Question Skip Logic</h2>
                            <p>{description[2]}</p>
                            <LazyLoadImage src={Banner3.src} visibleByDefault />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className={styles.slideshow}>
                            <h2>Visualization Dashboard</h2>
                            <p>{description[3]}</p>
                            <LazyLoadImage src={Banner4.src} visibleByDefault />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className={styles.slideshow}>
                            <h2>Export to Excel</h2>
                            <p>{description[4]}</p>
                            <LazyLoadImage src={Banner5.src} visibleByDefault />
                        </div>
                    </SwiperSlide>
                    <div className={styles.pagination}></div>
                </Swiper>
            </div>
            <div className={styles.content_container} style={{ ...style, justifyContent: isCenter && "center" }}>
                <Language className={styles.language} />
                <main>
                    <div className={styles.icon} onClick={() => router.push("/login")}>
                        <MainLogo />
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
};

LandingContainer.propTypes = {
    children: PropTypes.node,
    description: PropTypes.arrayOf(PropTypes.string),
    isLoading: PropTypes.bool,
    isCenter: PropTypes.bool,
    style: PropTypes.object,
};

export default LandingContainer;
