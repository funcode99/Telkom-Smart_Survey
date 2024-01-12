import Image from "next/image";
import styles from "./Template.module.scss";
import PropTypes from "prop-types";
import { FaCheck } from "react-icons/fa";

import { Button } from "../../global/Button";

const Card = ({ data, active, setActive }) => {
    return (
        <div className={styles.card} onClick={() => setActive(data.id)}>
            <Image src={data.image} alt={"template " + data.id} width={116} height={164} />
            {active === data.id && (
                <div className={styles.overlay}>
                    <FaCheck />
                </div>
            )}
        </div>
    );
};

const Template = ({ list, active, setActive, download }) => {
    return (
        <div className={styles.container}>
            <div className={styles.card_container}>
                {list.map((template) => {
                    return <Card data={template} key={template.id} active={active} setActive={setActive} />;
                })}
            </div>
            <Button onClick={download} className={styles.button}>
                DOWNLOAD
            </Button>
        </div>
    );
};

Card.propTypes = {
    data: PropTypes.string,
    active: PropTypes.string,
    setActive: PropTypes.string
};

Template.propTypes = {
    list: PropTypes.string,
    active: PropTypes.string,
    setActive: PropTypes.string,
    download: PropTypes.string,
};

export default Template;
