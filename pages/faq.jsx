import { useRef } from "react";
import PropTypes from "prop-types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ReactHtmlParser from "react-html-parser";
import styles from "./Faq.module.scss";

import { auth } from "../utils/useAuth";
import { MdArrowForwardIos } from "react-icons/md";

import Sidebar from "../components/wrapper/sidebar/Sidebar";
import faqList from "../public/data/faq_id.json";

const Accordion = ({ title, content }) => {
    const panelRef = useRef();

    return (
        <div className={styles.accordion}>
            <button
                onClick={() => {
                    if (panelRef.current.style.maxHeight) {
                        panelRef.current.style.maxHeight = null;
                    } else {
                        panelRef.current.style.maxHeight = panelRef.current.scrollHeight + "px";
                    }
                }}
            >
                <h5>{title}</h5>
                <MdArrowForwardIos />
            </button>
            <div className={styles.panel} ref={panelRef}>
                {ReactHtmlParser(content)}
            </div>
        </div>
    );
};

const Faq = () => {
    return (
        <Sidebar>
            <h3 className={styles.title}>Butuh Bantuan? Lihat Disini Ya!</h3>
            <div className={styles.body}>
                {faqList.map((faq, index) => {
                    return <Accordion title={faq.title} content={faq.content} key={index} />;
                })}
            </div>
        </Sidebar>
    );
};

Accordion.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default auth(Faq);
