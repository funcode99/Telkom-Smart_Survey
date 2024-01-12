import Image from "next/image";
import PropTypes from "prop-types";
import styles from "./Card.module.scss";

import { BsZoomIn } from "react-icons/bs";

const Card = ({ label, image, isActive, onClick }) => {
    return (
        <div className={styles.container + (isActive ? " " + styles.active : "")} onClick={onClick}>
            <div className={styles.image}>
                {image && (
                    <>
                        <Image src={image} alt="img" layout="fill" objectFit="contain" />
                        <div className={styles.zoom}>
                            <BsZoomIn />
                        </div>
                    </>
                )}
            </div>

            <label className={styles.label}>{label}</label>
        </div>
    );
};

Card.propTypes = {
    label: PropTypes.string,
    image: PropTypes.string,
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
};

export default Card;
