import PropTypes from "prop-types";
import Link from "next/link";
import Fade from "react-reveal/Fade";
import styles from "./TryCard.module.scss";

const TryCard = ({ t }) => {
    return (
        <div className={styles.container}>
            <Fade bottom>
                <div className={styles.body}>
                    <h3>{t("trycard_content")}</h3>
                    <p>{t("trycard_content_body")}</p>
                    <Link href="/register">
                        <a>
                            <button>{"SIGN UP, IT'S FREE!"}</button>
                        </a>
                    </Link>
                </div>
            </Fade>
        </div>
    );
};

TryCard.propTypes = {
    t: PropTypes.func,
};

export default TryCard;
