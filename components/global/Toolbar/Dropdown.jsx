import PropTypes from "prop-types";
import styles from "./Dropdown.module.scss";

import Dropdown from "../Dropdown";

const DropdownList = ({ dropdownList, dropdownStyle }) => {
    return (
        <div className={styles.container} style={dropdownStyle}>
            {dropdownList?.map((dropdown) => {
                return (
                    <div className={styles.dropdown} key={dropdown.id}>
                        <Dropdown
                            id={dropdown.id}
                            options={dropdown.options}
                            onSelect={(value, data) => {
                                dropdown.onSelect(value, data);
                            }}
                            value={dropdown.value}
                            style={{ height: "2.5rem" }}
                            isFloating
                        />
                    </div>
                );
            })}
        </div>
    );
};

DropdownList.propTypes = {
    dropdownList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string,
                    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                })
            ),
        })
    ),
    dropdownStyle: PropTypes.object,
};

export default DropdownList;
