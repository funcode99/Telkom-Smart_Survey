import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./MapsPicker.module.scss";

import { MdClose } from "react-icons/md";

import ModalContainer from "../modal/ModalContainer";

const MapsPicker = ({ latLng, setData, close }) => {
    const mapRef = useRef();
    const inputRef = useRef();
    const buttonRef = useRef();

    const [show, setShow] = useState(false);

    let googleMap;
    let mainMarker;
    let autocomplete;

    useEffect(() => {
        if (typeof window !== "undefined") initialize(latLng);
    }, [latLng]);

    const initialize = (latLng) => {
        if (latLng) setShow(true);

        googleMap = new window.google.maps.Map(mapRef.current, {
            zoom: latLng ? 18 : 5,
            center: latLng
                ? {
                      lat: latLng.lat,
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
            draggable: true,
        });

        autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            fields: ["formatted_address", "geometry", "name"],
            strictBounds: false,
            types: ["establishment"],
        });

        googleMap.addListener("click", async (e) => {
            const coordinate = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            mainMarker.setPosition(coordinate);
            mainMarker.setVisible(true);
            setShow(true);
        });

        autocomplete.bindTo("bounds", googleMap);
        autocomplete.addListener("place_changed", async () => {
            mainMarker.setVisible(false);

            const place = autocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, then present it on a googleMap.
            if (place.geometry.viewport) {
                googleMap.fitBounds(place.geometry.viewport);
            } else {
                googleMap.setCenter(place.geometry.location);
                googleMap.setZoom(17);
            }

            const coordinate = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
            mainMarker.setPosition(coordinate);
            mainMarker.setVisible(true);
            setShow(true);
        });

        window.google.maps.event.addDomListener(buttonRef.current, "click", async () => {
            const coordinate = { lat: mainMarker.getPosition().lat(), lng: mainMarker.getPosition().lng() };
            const address = await getAddress(coordinate);
            setData({ coordinate, address });
        });
    };

    const getAddress = async (location) => {
        return new Promise((resolve) => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location }, (response) => {
                resolve(response[0]?.formatted_address || "");
            });
        });
    };

    return (
        <ModalContainer show={true} customContainer={{ padding: "1rem", overflow: "hidden" }}>
            <div className={styles.container}>
                <input ref={inputRef} className={styles.searchbox} placeholder="Cari lokasi anda disini ..." />
                <MdClose className={styles.close} onClick={close} />
                <div ref={mapRef} className={styles.maps_container} />
                <button ref={buttonRef} className={styles.button} style={{ bottom: show && ".5rem" }}>
                    SAVE
                </button>
            </div>
        </ModalContainer>
    );
};

MapsPicker.propTypes = {
    latLng: PropTypes.exact({
        lat: PropTypes.number,
        lng: PropTypes.number,
    }),
    setData: PropTypes.func,
    close: PropTypes.func,
};

export default MapsPicker;
