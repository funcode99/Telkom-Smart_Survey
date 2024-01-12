import { useEffect, useState } from "react";
import useModal from "./useModal"

const useTour = (ref) => {
    const { setModal } = useModal("welcome-tour")

    const closeTour = () => {
        if (ref.current) {
            ref.current.style.zIndex = null
        }
    }

    useEffect(() => {
        console.log(ref.current)
        if (ref.current) {
            // ref.current.style.zIndex = 999
            ref.current.addEventListener("click", (e) => {
                e.preventDefault()
                e.stopPropagation()
            })
            setModal(true)
        }

    }, []);



    return { closeTour }
};

export default useTour;
