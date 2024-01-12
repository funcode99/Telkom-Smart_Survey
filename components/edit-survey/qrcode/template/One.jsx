// import { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import styles from "./One.module.scss";

import LogoWhite from "../../../../public/images/logo/logo_white.svg";

const One = ({ qrRef, merchant }) => {
    return (
        <div className={styles.container} id="paper-pdf">
            <div className={styles.section}>
                <div className={styles.logo}>
                    <Image src={merchant?.logo} alt={merchant?.name} layout="fill" objectFit="contain" />
                </div>
            </div>

            <div className={styles.qrcode} ref={qrRef}>
                <div className={styles.scan_me}>
                    <label className={styles.text} contentEditable="true" spellCheck={false}>
                        Scan Me
                    </label>
                    <div />
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.bottom}>
                    <label className={styles.text} contentEditable="true" spellCheck={false}>
                        Terima kasih atas kunjungannya
                    </label>
                    <label className={styles.text_secondary} contentEditable="true" spellCheck={false}>
                        Silahkan scan <b>QR Code</b> untuk mendapatkan voucher
                        <br />
                        diskon senilai Rp10.000 dan membantu kami
                        <br />
                        memberikan pelayanan yang lebih baik lagi ya!
                    </label>
                    <div className={styles.sponsor}>
                        <span>Powered by</span>
                        <LogoWhite />
                    </div>
                </div>
            </div>
        </div>
    );
};

One.propTypes = {
    qrRef: PropTypes.string,
    merchant: PropTypes.string,
};

export default One;
