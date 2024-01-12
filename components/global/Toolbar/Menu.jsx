import PropTypes from "prop-types";
import { isMobile } from "detect-mobile-device";
import styles from "./Menu.module.scss";

const MenuList = ({ menuList, menuStyle }) => {
    return (
        <div className={styles.container + (isMobile() ? " " + styles.mobile : "")} style={menuStyle}>
            {menuList?.options?.map((menu) => {
                return (
                    <label
                        className={menu.value === menuList.value ? styles.active : null}
                        onClick={() => menuList.onClick(menu.value, menu)}
                        key={menu.value}
                    >
                        {menu.label}
                    </label>
                );
            })}
        </div>
    );
};

MenuList.propTypes = {
    menuList: PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onClick: PropTypes.func,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                value: PropTypes.string,
            })
        ),
    }),
    menuStyle: PropTypes.object,
};

export default MenuList;
