import Link from "next/link";
import PropTypes from "prop-types";
import styles from "./InfoCard.module.scss";

const InfoCard = ({ icon, label, value, isLoading, redirect }) => {
    return (
        <div className={styles.container}>
            {redirect ? (
                <Link href={redirect}>
                    <a className={styles.link}>
                        <div className={styles.image}>{icon}</div>
                        <div className={styles.content}>
                            <span>{label}</span>
                            {!isLoading && <span className={styles.value}>{value}</span>}
                        </div>
                    </a>
                </Link>
            ) : (
                <div className={styles.link}>
                    <div className={styles.image}>{icon}</div>
                    <div className={styles.content}>
                        <span>{label}</span>
                        {!isLoading && <span className={styles.value}>{value}</span>}
                    </div>
                </div>
            )}
        </div>
    );
};

InfoCard.propTypes = {
    icon: PropTypes.node,
    label: PropTypes.string,
    value: PropTypes.number,
    isLoading: PropTypes.bool,
    redirect: PropTypes.string,
};

export default InfoCard;
