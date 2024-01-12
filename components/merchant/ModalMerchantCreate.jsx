import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { TimePicker } from "@material-ui/pickers";
import styles from "./ModalMerchant.module.scss";

import { userProfile } from "../../utils/recoil";
import { useRecoilState } from "recoil";
import { registerMerchant } from "../../utils/api/merchantApi";
import ClockIcon from "../../public/images/merchant/clock_icon.svg";
import { uploadFile } from "../../utils/functions";
import useModal from "../../utils/useModal";

import { ModalHeader as Header } from "../global/Header";
import ModalContainer from "../modal/ModalContainer";
import Input from "../global/Input";
import { Button, ButtonContainer } from "../global/Button";
import MapsPicker from "./MapsPicker";

const ModalMerchantCreate = ({ onSuccess }) => {
    const [latLng, setLatLng] = useState(null);
    const [openPicker, setPicker] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const { modal, setModal } = useModal("create-merchant");
    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    const mapRef = useRef();
    const [mapRefReady, setMapRefReady] = useState(false);
    const [timePickerState, setTimePickerState] = useState(null);

    const { t } = useTranslation("merchant");
    const { t: t_c } = useTranslation("common");
    const [profile, setProfile] = useRecoilState(userProfile);

    let googleMap;
    let mainMarker;
    console.log(mainMarker);

    const initialize = (latLng) => {
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
        if (typeof window !== "undefined" && modal && mapRefReady) initialize(latLng);
    }, [modal, latLng, mapRefReady]);

    useEffect(() => {
        if (modal) reset({ open_hour: "07:00", close_hour: "20:00" });
    }, [modal]);

    const submitHandler = (input, e) => {
        e.preventDefault();
        setLoading(true);

        registerMerchant({
            name: input.name,
            address: [input.address],
            logo: input.logo?.data,
            openHours: `${input.open_hour}-${input.close_hour}`,
        })
            .then(async () => {
                setProfile({ ...profile, merchant: { status: "pending" } });
                setModal(false);
                onSuccess();
            })
            .catch((reject) => {
                console.log(reject);
                toast.error(reject);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (openPicker)
        return (
            <MapsPicker
                latLng={latLng}
                setData={(data) => {
                    console.log(data);
                    setPicker(false);
                    setLatLng(data.coordinate);
                    setValue("address.lat", data.coordinate?.lat);
                    setValue("address.long", data.coordinate?.lng);
                    setValue("address.text", data.address);
                }}
                close={() => setPicker(false)}
            />
        );

    return (
        <ModalContainer
            show={modal}
            customContainer={{ width: "30rem" }}
            onClose={() => {
                setLatLng(null);
                reset({ open_hour: "07:00", close_hour: "20:00" });
            }}
            isLoading={isLoading}
        >
            <form onSubmit={handleSubmit(submitHandler)}>
                <Header title={t("merchant_create")} />
                <Input
                    label={t("merchant_name")}
                    controller={register("name", {
                        required: t_c("error_required"),
                    })}
                    error={errors.name}
                />
                <Input label={t("merchant_address")}>
                    <div style={{ position: "relative" }}>
                        <div
                            ref={(element) => {
                                mapRef.current = element;
                                setMapRefReady(!!element);
                            }}
                            className={styles.maps_container}
                        />
                        <div className={styles.maps_overlay} style={{ backgroundColor: latLng && "transparent" }} />
                        <div className={styles.maps_picker} style={{ opacity: latLng && 0 }}>
                            <span onClick={() => setPicker(true)} style={{ width: latLng && "100%", height: latLng && "100%" }}>
                                {t("merchant_choose_address")}
                            </span>
                        </div>
                    </div>
                </Input>
                {latLng && (
                    <Input error={errors.name} style={{ marginTop: ".5rem" }}>
                        <textarea
                            {...register("address.text", {
                                required: t_c("error_required"),
                            })}
                            rows={3}
                        />
                    </Input>
                )}
                <Input label={t("merchant_open_hour")} error={errors.open}>
                    <div className={styles.time_picker} onClick={() => setTimePickerState("open")}>
                        <span>{watch("open_hour") + " - " + watch("close_hour")}</span>
                        <ClockIcon />
                    </div>
                    <TimePicker
                        TextFieldComponent={() => null}
                        open={timePickerState === "open"}
                        cancelLabel={null}
                        format="HH:mm"
                        value={moment(watch("open_hour"), "HH:mm").toDate()}
                        onChange={(date) => {
                            setValue("open_hour", moment(date).format("HH:mm"));
                            setTimePickerState(null);
                            setTimeout(() => {
                                setTimePickerState("close");
                            }, 300);
                        }}
                        autoOk
                    />
                    <TimePicker
                        TextFieldComponent={() => null}
                        open={timePickerState === "close"}
                        cancelLabel={null}
                        format="HH:mm"
                        value={moment(watch("close_hour"), "HH:mm").toDate()}
                        onChange={(date) => {
                            setValue("close_hour", moment(date).format("HH:mm"));
                            setTimePickerState(null);
                        }}
                        autoOk
                    />
                </Input>
                <Input label={t("merchant_logo")} error={errors.logo}>
                    <Controller
                        control={control}
                        name="logo"
                        rules={{ required: t_c("error_required") }}
                        render={({ field: { value, onChange } }) => {
                            return (
                                <div className={styles.image_picker}>
                                    <input disabled className={styles.dummy} />
                                    <input disabled className={styles.text} value={value?.metadata?.name} />
                                    <Button
                                        type="button"
                                        onClick={async () => {
                                            const image = await uploadFile();
                                            if (image.error) return toast.error(image.error);
                                            onChange(image);
                                        }}
                                    >
                                        {t_c("image_picker")}
                                    </Button>
                                </div>
                            );
                        }}
                    />
                </Input>
                <ButtonContainer style={{ marginTop: "1rem" }}>
                    <Button style={{ flex: 1 }} isTransparent onClick={() => setModal(false)}>
                        {t_c("cancel")}
                    </Button>
                    <Button style={{ flex: 1 }} isLoading={isLoading} isSubmit>
                        {t_c("save")}
                    </Button>
                </ButtonContainer>
            </form>
        </ModalContainer>
    );
};

ModalMerchantCreate.propTypes = {
    onSuccess: PropTypes.func,
};

export default ModalMerchantCreate;
