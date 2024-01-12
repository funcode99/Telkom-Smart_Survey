import { useEffect, useState } from "react";

const useOverlay = (isOpen, setOpen, identifier, selector = "#") => {
    const [elementClick, setElementClick] = useState(null);

    useEffect(() => {
        const handleClick = (e) => {
            setElementClick(e.target?.closest(selector + identifier) ? true : false);
        };

        document.addEventListener("click", handleClick);
        return function cleanup() {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    useEffect(() => {
        if (isOpen && !elementClick) setOpen(false);
    }, [elementClick]);

    return;
};

export default useOverlay;
