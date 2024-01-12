import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import styles from "./ModalShare.module.scss";
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
import {
    EmailShareButton,
    WhatsappShareButton,
    TelegramShareButton,
    FacebookShareButton,
    TwitterShareButton,
    LineShareButton,
    EmailIcon,
    WhatsappIcon,
    TelegramIcon,
    FacebookIcon,
    TwitterIcon,
    LineIcon,
} from "react-share";

import { automaticApproval } from "../../../utils/api/userApi";
import useModal from "../../../utils/useModal";
import { MdClose } from "react-icons/md";

import ModalContainer from "../../modal/ModalContainer";
import { Button, ButtonContainer } from "../../global/Button";

const ShareKey = ({ surveyId, shareKey = "", setShareKey, refProps }) => {
    const [isLoading, setIsLoading] = useState(false);

    const getLink = () => {
        setShareKey("");
        setIsLoading(true);

        automaticApproval({ surveyId })
            .then((resolve) => {
                console.log(resolve);
                setShareKey(resolve.key);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <section>
            <button onClick={getLink} disabled={isLoading} className={styles.link_button}>
                {`GENERATE ${shareKey && "NEW "}LINK`}
            </button>
            {shareKey && (
                <div className={styles.link_container}>
                    <label>Share link</label>
                    <div className={styles.link}>
                        <input value={process.env.NEXT_PUBLIC_SHARE_URL + "/" + shareKey} disabled ref={refProps} />
                        <button
                            onClick={() => {
                                if (typeof navigator !== "undefined") {
                                    navigator.clipboard.writeText(refProps.current.value);
                                    toast.info("Copied to clipboard");
                                }
                            }}
                        >
                            copy
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

const ModalShare = ({ initialKey, surveyName, text }) => {
    const [shareKey, setShareKey] = useState(initialKey);
    const { modal, setModal } = useModal("share-link");
    const router = useRouter();
    const surveyId = router.query.surveyId;
    const app = useRef();
    const qrRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            if (qrRef.current && modal) qrCode.append(qrRef.current);
        }, 100);
    }, [modal]);

    useEffect(() => {
        qrCode.update({
            data: process.env.NEXT_PUBLIC_SHARE_URL + "/" + shareKey,
        });
    }, [shareKey]);

    useEffect(() => {
        setShareKey(initialKey);
    }, [initialKey]);

    const downloadHandler = () => {
        qrCode.update({
            data: process.env.NEXT_PUBLIC_SHARE_URL + "/" + shareKey,
        });
        qrCode.download({
            extension: "png",
        });
    };

    return (
        <ModalContainer show={modal} customContainer={{ width: "30rem" }}>
            <div className={styles.title}>
                <h3>{text.title}</h3>
                <MdClose
                    onClick={() => {
                        setModal(false);
                    }}
                />
            </div>
            <ShareKey surveyId={surveyId} shareKey={shareKey} setShareKey={setShareKey} refProps={app} />
            <div className={styles.social_media}>
                <div className={styles.social_icon}>
                    <EmailShareButton url={process.env.NEXT_PUBLIC_SHARE_URL + "/" + shareKey} subject={surveyName}>
                        <EmailIcon size={45} round /> <label>Email</label>
                    </EmailShareButton>
                </div>
                <div className={styles.social_icon}>
                    <WhatsappShareButton url={process.env.NEXT_PUBLIC_SHARE_URL + "/" + shareKey} title={surveyName}>
                        <WhatsappIcon size={45} round /> <label>Whatsapp</label>
                    </WhatsappShareButton>
                </div>
                <div className={styles.social_icon}>
                    <TelegramShareButton url={process.env.NEXT_PUBLIC_SHARE_URL + "/" + shareKey} title={surveyName}>
                        <TelegramIcon size={45} round />
                        <label>Telegram</label>
                    </TelegramShareButton>
                </div>
                <div className={styles.social_icon}>
                    <FacebookShareButton url={process.env.NEXT_PUBLIC_SHARE_URL + "/" + shareKey} quote={surveyName}>
                        <FacebookIcon size={45} round />
                        <label>Facebook</label>
                    </FacebookShareButton>
                </div>
                <div className={styles.social_icon}>
                    <TwitterShareButton url={process.env.NEXT_PUBLIC_SHARE_URL + "/" + shareKey} title={surveyName}>
                        <TwitterIcon size={45} round />
                        <label>Twitter</label>
                    </TwitterShareButton>
                </div>
                <div className={styles.social_icon}>
                    <LineShareButton url={process.env.NEXT_PUBLIC_SHARE_URL + "/" + shareKey} title={surveyName}>
                        <LineIcon size={45} round />
                        <label>Line</label>
                    </LineShareButton>
                </div>
            </div>
            {shareKey && <span className={styles.qrcode_title}>{text.qrcode}</span>}
            <div className={styles.qrcode} ref={qrRef} />
            {shareKey && (
                <ButtonContainer style={{ marginTop: "1rem" }}>
                    <Button
                        onClick={() => {
                            router.replace("/edit-survey/qrcode/" + shareKey);
                            setModal(false);
                        }}
                        isTransparent
                        style={{ flex: 1 }}
                    >
                        Customize
                    </Button>
                    <Button onClick={downloadHandler} style={{ flex: 1 }}>
                        {text.download}
                    </Button>
                </ButtonContainer>
            )}
        </ModalContainer>
    );
};

ShareKey.propTypes = {
    surveyId: PropTypes.string,
    shareKey: PropTypes.string,
    setShareKey: PropTypes.func,
    refProps: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.elementType })]),
};

ModalShare.propTypes = {
    initialKey: PropTypes.string,
    surveyName: PropTypes.string,
    text: PropTypes.object,
};

export default ModalShare;

{
    /* <div className={styles.reference_container}>
                <button className={styles.placeholder} onClick={() => setOpen(!isOpen)}>
                    <span>API Reference</span>
                    <Arrow style={{ transform: isOpen && `scaleY(-1)` }} />
                </button>
                <div className={styles.panel} ref={panelRef} style={{ maxHeight: isOpen && panelRef.current.scrollHeight }}>
                    <section className={styles.link_container}>
                        <label>Get Survey Endpoint</label>
                        <div className={styles.link}>
                            <input value={`${process.env.NEXT_PUBLIC_API_URL}/v1/smart-survey/app/${surveyId}?appKey=token`} disabled ref={api1} />
                            <button
                                onClick={() => {
                                    if (typeof navigator !== "undefined") {
                                        navigator.clipboard.writeText(api1.current.value);
                                        toast.info("Copied to clipboard");
                                    }
                                }}
                            >
                                COPY
                            </button>
                        </div>
                    </section>
                    <section className={styles.link_container}>
                        <label>Create Answer Endpoint</label>
                        <div className={styles.link}>
                            <input value={`${process.env.NEXT_PUBLIC_API_URL}/v1/smart-survey/app/answer?appKey=token`} disabled ref={api2} />
                            <button
                                onClick={() => {
                                    if (typeof navigator !== "undefined") {
                                        navigator.clipboard.writeText(api2.current.value);
                                        toast.info("Copied to clipboard");
                                    }
                                }}
                            >
                                COPY
                            </button>
                        </div>
                    </section>
                    <section className={styles.link_container}>
                        <label>Get Answer Endpoint</label>
                        <div className={styles.link}>
                            <input
                                value={`${process.env.NEXT_PUBLIC_API_URL}/v1/smart-survey/app/answer?surveyId=${surveyId}&appKey=token`}
                                disabled
                                ref={api3}
                            />
                            <button
                                onClick={() => {
                                    if (typeof navigator !== "undefined") {
                                        navigator.clipboard.writeText(api3.current.value);
                                        toast.info("Copied to clipboard");
                                    }
                                }}
                            >
                                COPY
                            </button>
                        </div>
                    </section>
                </div>
            </div> */
}
