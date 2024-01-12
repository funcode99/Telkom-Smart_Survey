import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import styles from "./ModalMerchant.module.scss";

import { setStatusMerchant } from "../../utils/api/merchantApi";
import ClockIcon from "../../public/images/merchant/clock_icon.svg";
import useModal from "../../utils/useModal";

import { ModalHeader as Header } from "../global/Header";
import ModalContainer from "../modal/ModalContainer";
import Input from "../global/Input";
import { Button, ButtonContainer } from "../global/Button";

const ModalMerchantCreate = ({ refresh }) => {
    const [input, setInput] = useState({});
    const [isLoading, setLoading] = useState(false);
    const { modal, data, setModal } = useModal("verify-merchant");

    const mapRef = useRef();
    const [mapRefReady, setMapRefReady] = useState(false);

    const { t } = useTranslation("merchant");
    const { t: t_c } = useTranslation("common");

    let googleMap;
    let mainMarker;
    console.log(mainMarker);

    const initialize = (latLng) => {
        console.log(latLng);
        googleMap = new window.google.maps.Map(mapRef.current, {
            zoom: latLng ? 15 : 5,
            center: latLng
                ? {
                      lat: latLng.lat + 0.001,
                      lng: latLng.lng,
                  }
                : {
                      lat: -0.7893,
                      lng: 113.9213,
                  },
            disableDefaultUI: true,
            gestureHandling: "greedy",
            clickableIcons: false,
            zoomControl: true,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: window.google.maps.ControlPosition.TOP_RIGHT,
            },
        });

        mainMarker = new window.google.maps.Marker({
            map: googleMap,
            zIndex: 2,
            visible: latLng ? true : false,
            position: latLng,
        });
    };

    useEffect(() => {
        if (typeof window !== "undefined" && modal && mapRefReady) initialize({ lat: data.address[0]?.lat, lng: data.address[0]?.long });
    }, [modal, mapRefReady]);

    useEffect(() => {
        if (modal && data.merchantId) setInput({ name: data.name, address: data.address[0]?.text, openHours: data.openHours, logo: data.logo });
    }, [modal]);

    const submitHandler = (status) => {
        setLoading(true);

        setStatusMerchant({ status }, data.merchantId)
            .then((resolve) => {
                console.log(resolve);
                refresh();
                toast.info(`Verify merchant success`);
                setModal(false);
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <ModalContainer
            show={modal}
            customContainer={{ width: "30rem" }}
            onClose={() => {
                setInput({});
            }}
            isLoading={isLoading}
        >
            <form>
                <Header title={"Verify Merchant"} close={{ onClick: () => setModal(false) }} />
                <Input label={t("merchant_name")} value={input.name} isDisabled />
                <Input label={t("merchant_address")}>
                    <div style={{ position: "relative" }}>
                        <div
                            ref={(element) => {
                                mapRef.current = element;
                                setMapRefReady(!!element);
                            }}
                            className={styles.maps_container}
                        />
                    </div>
                </Input>
                <Input style={{ marginTop: ".5rem" }}>
                    <textarea value={input.address} rows={3} disabled />
                </Input>
                <div className={styles.split}>
                    <Input label={t("merchant_open_hour")}>
                        <div className={styles.time_picker + " " + styles.disabled}>
                            <span>{input.openHours}</span>
                            <ClockIcon />
                        </div>
                    </Input>
                    <Input label={t("merchant_logo")}>
                        <Image src={input.logo} alt="logo" width={100} height={100} />
                    </Input>
                </div>
                <ButtonContainer style={{ marginTop: "1rem" }}>
                    <Button style={{ flex: 1 }} isTransparent onClick={() => submitHandler("rejected")}>
                        {t_c("reject")}
                    </Button>
                    <Button style={{ flex: 1 }} isLoading={isLoading} onClick={() => submitHandler("approved")}>
                        {t_c("approve")}
                    </Button>
                </ButtonContainer>
            </form>
        </ModalContainer>
    );
};

ModalMerchantCreate.propTypes = {
    refresh: PropTypes.func,
};

export default ModalMerchantCreate;
