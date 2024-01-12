import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styles from "./Editor.module.scss";
import PropTypes from "prop-types";

import "react-edit-text/dist/index.css";

let qrCode;
if (typeof window !== "undefined") {
    console.log("i am client");
    const QRCodeStyling = require("qr-code-styling");
    qrCode = new QRCodeStyling({
        width: 1000,
        height: 1000,
        margin: 50,
        qrOptions: { typeNumber: "0", mode: "Byte", errorCorrectionLevel: "Q" },
        imageOptions: { hideBackgroundDots: true, imageSize: 0.2, margin: 10 },
        dotsOptions: {
            type: "rounded",
            color: "#756ce0",
            gradient: {
                type: "radial",
                rotation: 0,
                colorStops: [
                    { offset: 0, color: "#aa80f9" },
                    { offset: 1, color: "#756ce0" },
                ],
            },
        },
        backgroundOptions: { color: "#ffffff", gradient: null },
        image: "https://i.ibb.co/SrpHzTQ/icon-200px.png",
        dotsOptionsHelper: {
            colorType: { single: true, gradient: false },
            gradient: { linear: true, radial: false, color1: "#6a1a4c", color2: "#6a1a4c", rotation: "0" },
        },
        cornersSquareOptions: { type: "extra-rounded", color: "#756ce0" },
        cornersSquareOptionsHelper: {
            colorType: { single: true, gradient: false },
            gradient: { linear: true, radial: false, color1: "#000000", color2: "#000000", rotation: "0" },
        },
        cornersDotOptions: { type: "", color: "#613583", gradient: null },
        cornersDotOptionsHelper: {
            colorType: { single: true, gradient: false },
            gradient: { linear: true, radial: false, color1: "#000000", color2: "#000000", rotation: "0" },
        },
        backgroundOptionsHelper: {
            colorType: { single: true, gradient: false },
            gradient: { linear: true, radial: false, color1: "#ffffff", color2: "#ffffff", rotation: "0" },
        },
    });
}

import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Editor = ({ template, list, merchant, setActive }) => {
    const { Template } = template;
    const router = useRouter();
    const qrRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            if (qrRef.current) qrCode.append(qrRef.current);
        }, 100);
    }, [Template]);

    useEffect(() => {
        qrCode.update({
            data: process.env.NEXT_PUBLIC_SHARE_URL + "/" + router.query.shareKey,
        });
    }, [Template]);

    return (
        <div className={styles.container}>
            <IoIosArrowBack
                className={styles.arrow + " " + styles.back}
                onClick={() => {
                    setActive(template.id === 0 ? list.length - 1 : template.id - 1);
                }}
            />
            <div className={styles.paper_container}>
                <Template qrRef={qrRef} merchant={merchant} />
                <div className={styles.paper_overlay} id="paper-overlay">
                    <BsFileEarmarkPdfFill />
                    <span>Generating PDF</span>
                </div>
            </div>
            <IoIosArrowForward
                className={styles.arrow + " " + styles.next}
                onClick={() => {
                    setActive(template.id === list.length - 1 ? 0 : template.id + 1);
                }}
            />
        </div>
    );
};

Editor.propTypes = {
    template: PropTypes.string,
    list: PropTypes.string,
    merchant: PropTypes.string,
    setActive: PropTypes.string,
};

export default Editor;
