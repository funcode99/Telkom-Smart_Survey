import PropTypes from "prop-types";
import styles from "./Tour.module.scss";

import { userProfile } from "../../utils/recoil";
import { useRecoilValue } from "recoil";
import { AiFillCaretLeft } from "react-icons/ai";

import WelcomeIcon from "../../public/images/home/welcome_icon.svg";
import { Button } from "../global/Button";
import ModalContainer from "../modal/ModalContainer";

const Tour = ({ position, index, setIndex, text }) => {
    const profile = useRecoilValue(userProfile);

    if (index === null) return null;

    if (index === 0)
        return (
            <ModalContainer
                show={true}
                customOverlay={{ alignItems: "center" }}
                customContainer={{ borderRadius: "1rem", border: "1px solid #A980F8" }}
            >
                <div className={styles.tooltip + " " + styles.main}>
                    <WelcomeIcon />
                    <h3>{text[0].title + profile.fullname}!</h3>
                    <p>{text[0].body}</p>
                    <Button onClick={() => setIndex(1)} style={{ width: "100%", height: "2.75rem" }}>
                        {"LET'S GO"}
                    </Button>
                </div>
            </ModalContainer>
        );

    return (
        <div className={styles.overlay}>
            <div className={styles.container} style={position} />
            <AiFillCaretLeft className={styles.caret} style={{ left: position.left + position.width, top: position.top + position.height / 2 }} />
            <div className={styles.tooltip} style={{ left: position.left + position.width + 24, top: position.top + position.height / 2 }}>
                <h3>{text[index]?.title}</h3>
                <p>{text[index]?.body}</p>
                <div className={styles.button_container}>
                    <div className={styles.dots}>
                        <div className={index === 1 ? styles.active : null} />
                        <div className={index === 2 ? styles.active : null} />
                        <div className={index === 3 ? styles.active : null} />
                        <div className={index === 4 ? styles.active : null} />
                        <div className={index === 5 ? styles.active : null} />
                    </div>
                    <Button
                        style={{ width: "6.25rem" }}
                        onClick={() => {
                            if (index < 5) {
                                setIndex(index + 1);
                            } else {
                                setIndex(null);

                                const tourState = window.localStorage.getItem("tourState");
                                if (tourState) {
                                    const tourData = JSON.parse(tourState);
                                    window.localStorage.setItem(
                                        "tourState",
                                        JSON.stringify({ ...tourData, [profile.userId]: { ...tourData[profile.userId], home: true } })
                                    );
                                }
                            }
                        }}
                    >
                        {index < 5 ? "NEXT" : "DONE"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

Tour.propTypes = {
    index: PropTypes.number,
    setIndex: PropTypes.func,
    position: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
        top: PropTypes.number,
        left: PropTypes.number,
    }),
    text: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            body: PropTypes.string,
        })
    ),
};

export default Tour;
