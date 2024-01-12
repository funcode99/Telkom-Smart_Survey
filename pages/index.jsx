import { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { authReverse } from "../utils/useAuth";

import Header from "../components/landing/Header";
import MainBanner from "../components/landing/MainBanner";
import Description from "../components/landing/Description";
import Features from "../components/landing/Features";
import FeaturesImage from "../components/landing/FeaturesImage";
import Sample from "../components/landing/Sample";
import TryCard from "../components/landing/TryCard";
import Footer from "../components/landing/Footer";
import Sidebar from "../components/landing/Sidebar";

const LandingPage = () => {
    const [isResponsive, setResponsive] = useState(typeof window !== "undefined" ? window.innerWidth <= 768 : false);
    const [isOpen, setOpen] = useState(false);
    const elementRef = useRef();
    const { t } = useTranslation("landing");

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setResponsive(true);
            } else {
                setResponsive(false);
            }
        };

        if (window !== "undefined") window.addEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [isResponsive]);

    return (
        <div>
            <Header setOpen={setOpen} isResponsive={isResponsive} />
            <MainBanner elementRef={elementRef} isResponsive={isResponsive} t={t} />
            <Description t={t} />
            <Features t={t} />
            <FeaturesImage isResponsive={isResponsive} t={t} />
            <Sample elementRef={elementRef} t={t} />
            <TryCard t={t} />
            <Footer t={t} />
            {isResponsive && <Sidebar isOpen={isOpen} setOpen={setOpen} />}
        </div>
    );
};

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["landing", "login"])),
        },
    };
};

export default authReverse(LandingPage);
