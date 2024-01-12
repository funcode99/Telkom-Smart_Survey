import PropTypes from "prop-types";
import Link from "next/link";
import styles from "./NotFound.module.scss";


import NotFound from "../../public/images/survey/not_found_icon.svg";

const Intro = () => {
    return (
        <div className={styles.container}>
            <div className={styles.body}>
                <NotFound />
                <span>{"Survey not exist or you don't have access"}</span>
                <button>
                    <Link href="/">
                        Back to Home
                    </Link>
                </button>
            </div>
        </div>
    );
};

Intro.propTypes = {
    survey: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        surveyImage: PropTypes.string,
    }),
    onNext: PropTypes.func,
    button: PropTypes.string,
};

export default Intro;
