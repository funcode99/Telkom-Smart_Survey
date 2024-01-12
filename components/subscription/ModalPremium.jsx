import { useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import styles from "./Modal.module.scss";

import useModal from "../../utils/useModal";
import RadioChecked from "../../public/images/global/radio_checked.svg";
import RadioUncheck from "../../public/images/global/radio_uncheck.svg";

import ModalContainer from "../modal/ModalContainer";
import { ModalHeader as Header } from "../global/Header";
import { ButtonContainer, Button } from "../global/Button";

const ModalPremium = ({ text_common }) => {
    const [duration, setDuration] = useState("");
    const { modal, setModal } = useModal("buy-premium");
    const router = useRouter();

    return (
        <ModalContainer show={modal} onClose={() => setDuration("")} isCenter>
            <Header title="Langganan Premium" />
            <div className={styles.container}>
                <div className={styles.card} onClick={() => setDuration("month")}>
                    {duration === "month" ? <RadioChecked /> : <RadioUncheck />}
                    <div>
                        <label>Monthly</label>
                        <span>
                            Rp
                            <b>5.000</b>
                            <span>/bulan</span>
                        </span>
                    </div>
                </div>
                <div className={styles.card} onClick={() => setDuration("year")}>
                    {duration === "year" ? <RadioChecked /> : <RadioUncheck />}
                    <div>
                        <label>Yearly</label>
                        <span>
                            Rp
                            <b>50.000</b>
                            <span>/tahun</span>
                        </span>
                    </div>
                </div>
            </div>
            <p className={styles.notice}>* belum termasuk PPN 10%</p>
            <ButtonContainer>
                <Button onClick={() => setModal(false)} style={{ flex: 1 }} isTransparent>
                    {text_common("cancel")}
                </Button>
                <Button isDisabled={!duration} onClick={() => router.push("/payment/subscription?duration=" + duration)} style={{ flex: 1 }}>
                    {text_common("next")}
                </Button>
            </ButtonContainer>
        </ModalContainer>
    );
};

ModalPremium.propTypes = {
    text_common: PropTypes.func,
};

export default ModalPremium;
