import Link from "next/link";
import styles from "./SurveySample.module.scss";

import { BiDownload } from "react-icons/bi";
import MainLogo from "../public/images/main_logo.svg";
import Card from "../components/card/SurveyCard";
import { Button, ButtonContainer } from "../components/global/Button";

const SurveySample = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/">
                    <a>
                        <div className={styles.logo}>
                            <MainLogo />
                            <b>Smart</b> Survey
                        </div>
                    </a>
                </Link>
                <ButtonContainer style={{ height: "2.25rem", justifyContent: "flex-end", gap: "1.5rem" }}>
                    <Button style={{ width: "7rem" }}>
                        <Link href="/register">SIGN UP </Link>
                    </Button>

                    <Button style={{ width: "7rem", color: "#fff", borderColor: "#fff" }} isTransparent>
                        <Link href="/login">LOGIN</Link>
                    </Button>
                </ButtonContainer>
            </header>
            <main className={styles.body}>
                <div className={styles.title}>
                    <h2>Want to see our sample Survey?</h2>
                    <p>Please have a look at our sample surveys</p>
                </div>
                <div div className={styles.card_container}>
                    {Array.from({ length: 12 }).map((_, index) => {
                        return (
                            <Card
                                survey={{ title: "Dummy Title", description: "Dummy Description" }}
                                key={index}
                                footer={
                                    <div className={styles.footer}>
                                        <BiDownload />
                                        <span>
                                            <b>423.212</b> Used
                                        </span>
                                    </div>
                                }
                            />
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default SurveySample;
