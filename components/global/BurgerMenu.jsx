import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./BurgerMenu.module.scss";

import useOverlay from "../../utils/useOverlay";

import { BiMenu } from "react-icons/bi";

const BurgerMenu = ({ options, id }) => {
    const [isOpen, setOpen] = useState(false);
    useOverlay(isOpen, setOpen, id);

    return (
        <div className={styles.container} id={id}>
            <BiMenu onClick={() => setOpen(!isOpen)} />
            {isOpen && (
                <div className={styles.panel}>
                    {options.map((option) => {
                        return (
                            <span
                                key={option.value}
                                onClick={() => {
                                    option.onClick();
                                }}
                            >
                                {option.label}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

BurgerMenu.propTypes = {
    id: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string,
            onClick: PropTypes.func,
        })
    ),
};

export default BurgerMenu;
