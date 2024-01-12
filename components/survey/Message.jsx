import PropTypes from "prop-types";
import Link from "next/link";
import styles from "./Message.module.scss";
import SuccessIcon from "../../public/images/submit_success.svg";

const Success = ({ message = "Thank you, Your answer has been submitted!", message_on_back = "Back to Home", redirect = "/home" }) => {
    return (
        <div className={styles.container}>
            <div className={styles.body}>
                <SuccessIcon />
                <span>{message}</span>
                <button>
                    <Link href={redirect} replace>
                        {message_on_back}
                    </Link>
                </button>
            </div>
        </div>
    );
};

Success.propTypes = {
    message: PropTypes.string,
    message_on_back: PropTypes.string,
    redirect: PropTypes.string,
};

export default Success;
