import { useRouter } from "next/router";
import PropTypes from "prop-types";
import styles from "./Language.module.scss";

const Language = ({ className, isReverse, isMini }) => {
    const router = useRouter();

    return (
        <div
            className={
                styles.container + (isReverse ? " " + styles.reverse : "") + (isMini ? " " + styles.mini : "") + (className ? " " + className : "")
            }
            onClick={() => {
                window.localStorage.setItem("locale", router.locale === "en" ? "id" : "en");
                router.push(router.asPath, null, { locale: router.locale === "en" ? "id" : "en" });
            }}
        >
            <button className={router.locale === "id" ? styles.active : null}>ID</button>
            <button className={router.locale === "en" ? styles.active : null}>EN</button>
        </div>
    );
};

Language.propTypes = {
    className: PropTypes.string,
    isReverse: PropTypes.bool,
    isMini: PropTypes.bool,
};

export default Language;
