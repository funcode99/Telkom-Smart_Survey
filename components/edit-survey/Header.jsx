import { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-toastify";
import styles from "./Header.module.scss";

import { uploadFile } from "../../utils/functions";
import { editSurvey, submitSurvey } from "../../utils/api/surveyApi";

import EditIcon from "../../public/images/global/edit.png";
import Dummy from "../../public/images/survey/default_banner.jpg";
import useModal from "../../utils/useModal";
import { Button, ButtonContainer } from "../global/Button";
import ModalPopup from "./modal/ModalPopup";

const Header = ({ survey, updateData, t, t_c }) => {
    const [uploadLoading, setUploadLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { setModal: setModalShare } = useModal("share-link");
    const { setModal: setModalExport } = useModal("export-survey");
    const { setModal: setModalSubmit } = useModal("submit-survey");
    const router = useRouter();
    const surveyId = router.query.surveyId;

    const uploadHandler = async () => {
        if (uploadLoading) return;
        setUploadLoading(true);

        const image = await uploadFile();
        if (image.error) return toast.error(image.error);

        editSurvey({ surveyImage: image.data }, surveyId)
            .then((resolve) => {
                console.log(resolve);
                updateData({ surveyImage: resolve.surveyImage });
                toast.info(t("success_change_background"));
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setUploadLoading(false);
            });
    };

    const submitHandler = () => {
        setSubmitLoading(true);
        submitSurvey(router.query.surveyId)
            .then((resolve) => {
                toast.info(t("success_submit_survey"));
                updateData({ shareKey: resolve.shareKey, status: "final" });
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setSubmitLoading(false);
                setModalSubmit(false);
            });
    };

    return (
        <header className={styles.container}>
            <div className={styles.background}>
                <Image alt="banner" src={survey.surveyImage ? survey.surveyImage : Dummy.src} layout="fill" objectFit="cover" />
                <div className={styles.overlay} />
            </div>
            <div className={styles.main_container}>
                <div className={styles.title_container}>
                    <h1>{survey.title}</h1>
                    <span className="description">{survey.description}</span>
                </div>
                <div className={styles.upload_button} onClick={uploadHandler} style={{ cursor: uploadLoading && "wait" }}>
                    <span>{t("setting_change_background")}</span>
                    <Image src={EditIcon.src} width={24} height={24} alt="change_cover" />
                </div>
            </div>
            <ButtonContainer style={{ position: "relative", zIndex: 5, justifyContent: "flex-end", height: "2.5rem" }}>
                <Button
                    isTransparent
                    onClick={() => setModalExport(true)}
                    style={{ width: "fit-content", paddingLeft: ".75rem", paddingRight: ".75rem", color: "#fff", borderColor: "#fff" }}
                >
                    <span>DOWNLOAD SURVEY</span>
                </Button>

                <Link href={"/preview-survey/" + surveyId}>
                    <a>
                        <Button
                            isTransparent
                            style={{ width: "fit-content", paddingLeft: ".75rem", paddingRight: ".75rem", color: "#fff", borderColor: "#fff" }}
                        >
                            <span>PREVIEW SURVEY</span>
                        </Button>
                    </a>
                </Link>
                {survey.status === "final" ? (
                    <Button onClick={() => setModalShare(true)}>
                        <span>SHARE</span>
                    </Button>
                ) : (
                    <Button style={{ width: "7.8rem" }} onClick={() => setModalSubmit(true)}>
                        SUBMIT
                    </Button>
                )}
            </ButtonContainer>

            <ModalPopup
                modalIdentifier="submit-survey"
                title={t("warning_submit_title")}
                message={t("warning_submit_message")}
                buttonLabel={t_c("yes")}
                isLoading={submitLoading}
                onSubmit={submitHandler}
            />
        </header>
    );
};

Header.propTypes = {
    survey: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        surveyImage: PropTypes.string,
        status: PropTypes.oneOf(["draft", "final", "notActive"]),
    }),
    updateData: PropTypes.func,
    t: PropTypes.func,
    t_c: PropTypes.func,
};

export default Header;
