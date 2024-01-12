import styles from "./Footer.module.scss";

import { BsCircleFill } from "react-icons/bs";

const Footer = () => {
    return (
        <div className={styles.container}>
            <div className={styles.body}>
                <div>
                    <span>Copyright © 2021 SmartSurvey</span>
                </div>
                <div>
                    <span>Privacy Policy</span>
                    <BsCircleFill />
                    <span>Term of Use</span>
                </div>
            </div>
        </div>
    );
};

export default Footer;
