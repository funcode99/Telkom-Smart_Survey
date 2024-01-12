import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styles from "./Qrcode.module.scss";

import { useRecoilValue } from "recoil";
import { userProfile } from "../../../utils/recoil";

import Sidebar from "../../../components/wrapper/sidebar/Sidebar";
import Editor from "../../../components/edit-survey/qrcode/Editor";
import Template from "../../../components/edit-survey/qrcode/Template";

import Template1 from "../../../public/images/qrcode/Template1.jpg";
import Template2 from "../../../public/images/qrcode/Template2.jpg";
import Template3 from "../../../public/images/qrcode/Template3.jpg";
import Template4 from "../../../public/images/qrcode/Template4.jpg";
import Template5 from "../../../public/images/qrcode/Template5.jpg";
import Template6 from "../../../public/images/qrcode/Template6.jpg";

import TemplateOne from "../../../components/edit-survey/qrcode/template/One";
import TemplateTwo from "../../../components/edit-survey/qrcode/template/Two";

const templateList = [
    { Template: TemplateOne, id: 0, image: Template1 },
    { Template: TemplateTwo, id: 1, image: Template2 },
    { Template: TemplateOne, id: 2, image: Template3 },
    { Template: TemplateTwo, id: 3, image: Template4 },
    { Template: TemplateOne, id: 4, image: Template5 },
    { Template: TemplateTwo, id: 5, image: Template6 },
];

const Qrcode = () => {
    const [activeTemplate, setActiveTemplate] = useState(0);
    const profile = useRecoilValue(userProfile);

    const download = () => {
        const paper = document.getElementById("paper-pdf");
        const overlay = document.getElementById("paper-overlay");

        overlay.style.display = "flex";
        paper.style.transform = "scale(2)";

        html2canvas(paper).then((canvas) => {
            const imgData = canvas.toDataURL("image/jpg");
            const pdf = new jsPDF({
                orientation: "potrait",
                unit: "pt",
                format: "a5",
            });
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "JPG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("QRCode.pdf");

            paper.style.transform = null;
            overlay.style.display = null;
        });
    };

    return (
        <Sidebar style={{ paddingTop: 0, paddingBottom: 0, paddingRight: 0 }}>
            {/* <div></div>
            <PageHeader
                title="QRCode Editor"
                buttonList={[
                    {
                        label: "Download",
                        onClick: () => download(),
                    },
                ]}
            /> */}
            <div className={styles.container}>
                <Editor template={templateList[activeTemplate]} list={templateList} merchant={profile.merchant} setActive={setActiveTemplate} />
                <Template list={templateList} active={activeTemplate} setActive={setActiveTemplate} download={download} />
            </div>
            {/* <div id="export-pdfs" className={styles.export}>
                {cloneElement(<Editor />)}
            </div> */}
        </Sidebar>
    );
};

export const getServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "edit-survey"])),
    },
});

export default Qrcode;
