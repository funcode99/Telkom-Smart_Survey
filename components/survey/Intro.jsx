import PropTypes from "prop-types";
import Image from "next/image";
import styles from "./Intro.module.scss";

import { Button } from "../global/Button";
import Dummy from "../../public/images/survey/default_banner.jpg";

const Intro = ({ survey, button = "Take Survey", onNext, isPreview }) => {
    console.log(survey);
    return (
        <main className={styles.container}>
            <div className={styles.banner}>
                <Image alt="banner" src={survey.surveyImage ? survey.surveyImage : Dummy.src} layout="fill" objectFit="cover" />
            </div>
            <div className={styles.content}>
                <h3>{survey.title}</h3>
                <p>{survey.description}</p>
                <div className={styles.footer}>
                    {!isPreview && survey.transferPoint?._id && (
                        <div className={styles.reward}>
                            Reward Remaining: <b>{survey.transferPoint?.qty}</b>/{survey.transferPoint?.unit}
                        </div>
                    )}
                    <Button onClick={onNext} style={{ marginLeft: "auto" }}>
                        {button}
                    </Button>
                </div>
            </div>
        </main>
    );
};

Intro.propTypes = {
    survey: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        surveyImage: PropTypes.string,
        transferPoint: PropTypes.shape({
            _id: PropTypes.string,
            qty: PropTypes.number,
            unit: PropTypes.number,
        }),
    }),
    onNext: PropTypes.func,
    button: PropTypes.string,
    showReward: PropTypes.bool,
    isPreview: PropTypes.bool,
};

export default Intro;
