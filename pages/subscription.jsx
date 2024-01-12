import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import styles from "./Subscription.module.scss";

import { auth } from "../utils/useAuth";
import useModal from "../utils/useModal";
import BasicIcon from "../public/images/subscription/basic.png";
import PremiumIcon from "../public/images/subscription/premium.png";
import ChecklistIcon from "../public/images/subscription/checklist.svg";

import Sidebar from "../components/wrapper/sidebar/Sidebar";
import { PageHeader as Header } from "../components/global/Header";
import { Button } from "../components/global/Button";
import Modal from "../components/subscription/ModalPremium";

const Subscription = () => {
    const { setModal } = useModal("buy-premium");
    const { t: t_c } = useTranslation("common");

    return (
        <Sidebar>
            <Header title={t_c("subscription") + " Kutanya.com"} />
            <div className={styles.container}>
                <div className={styles.title}>
                    <h3>
                        Kamu sedang berlangganan di level : <b>Basic Plan (Gratis)</b>
                    </h3>
                    <p>Nikmati fitur tambahan lainnya yang memudahkanmu dalam melukan survey hanya dengan</p> <br />
                    <p>berlangganan menjadi Premium</p>
                </div>
                <div className={styles.card_container}>
                    <div className={styles.card}>
                        <h5 style={{ marginBottom: "1.5rem" }}>Basic</h5>
                        <Image src={BasicIcon.src} alt="basic" width={164} height={142} />
                        <div className={styles.price}>
                            <label>Free</label>
                        </div>
                        <div className={styles.features}>
                            <span className={styles.features_title}>Fitur Basic:</span>
                            <div className={styles.list_container}>
                                <div className={styles.list}>
                                    <ChecklistIcon />
                                    <span>Maks 100 responded/bulan</span>
                                </div>
                                <div className={styles.list}>
                                    <ChecklistIcon />
                                    <span>Salin Survey</span>
                                </div>
                                <div className={styles.list}>
                                    <ChecklistIcon />
                                    <span>Eksport Jawaban Excel</span>
                                </div>
                                <div className={styles.list}>
                                    <ChecklistIcon />
                                    <span>Google Sign In</span>
                                </div>
                                <div className={styles.list}>
                                    <ChecklistIcon />
                                    <span>Dashboard Hasil Survey</span>
                                </div>
                                <div className={styles.list}>
                                    <ChecklistIcon />
                                    <span>Group Survey</span>
                                </div>
                                <div className={styles.list}>
                                    <ChecklistIcon />
                                    <span>Reward Poin Responden</span>
                                </div>
                            </div>
                        </div>
                        <Button isDisabled>{t_c("subscribe")}</Button>
                    </div>
                    <div className={styles.card}>
                        <h5 style={{ marginBottom: "1.625rem" }}>Premium</h5>
                        <Image src={PremiumIcon.src} alt="basic" width={175} height={139} />
                        <div className={styles.price}>
                            <div>
                                <span className={styles.rupiah}>Rp</span>
                                <label>5.000</label>
                                <span>/bulan</span>
                            </div>
                            <div className={styles.separator} />
                            <div>
                                <span className={styles.rupiah}>Rp</span>
                                <label>50.000</label>
                                <span>/tahun</span>
                            </div>
                        </div>
                        <div className={styles.features}>
                            <span className={styles.features_title}>Fitur Premium:</span>
                            <div className={styles.list_container}>
                                <div className={styles.list}>
                                    <ChecklistIcon />
                                    <span>Semua Fitur Basic</span>
                                </div>
                                <div className={styles.list}>
                                    <ChecklistIcon />
                                    <span>Unlimited Responden</span>
                                </div>
                                <div className={styles.list}>
                                    <ChecklistIcon />
                                    <span>Bank Pertanyaan</span>
                                </div>
                                <div className={styles.list}>
                                    <ChecklistIcon />
                                    <span>Kustomisasi QR Code</span>
                                </div>
                                <div className={styles.list}>
                                    <ChecklistIcon />
                                    <span>Kustomisasi URL</span>
                                </div>
                                <div className={styles.list}>
                                    <ChecklistIcon />
                                    <span>Bebas Iklan</span>
                                </div>
                                <div className={styles.list}>
                                    <ChecklistIcon />
                                    <span>Reward Voucher Responden</span>
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => setModal(true)}>{t_c("subscribe")}</Button>
                    </div>
                </div>
            </div>
            <Modal text_common={t_c} />
        </Sidebar>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common", "subscription"])),
    },
});

export default auth(Subscription);
