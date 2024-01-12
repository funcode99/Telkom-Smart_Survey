import { useRef } from "react";
import PropTypes from "prop-types";
import { isMobile } from "detect-mobile-device";
import styles from "./Toolbar.module.scss";

import { AiOutlineSearch } from "react-icons/ai";

import Dropdown from "./Dropdown";
import Filter from "./Filter";
import Button from "./Button";
import Menu from "./Menu";

const Toolbar = ({
    render = [],
    renderMobile = [],
    menuList,
    dropdownList,
    buttonList,
    searchBox,
    style,
    className,
    menuStyle,
    dropdownStyle,
    buttonStyle,
    searchStyle,
}) => {
    const inputRef = useRef();

    if (isMobile() && renderMobile.length) {
        return (
            <div className={styles.container + " " + styles.mobile}>
                {renderMobile.map((row, index) => {
                    return (
                        <div className={styles.row} key={index}>
                            {row.map((component) => {
                                switch (component) {
                                    case "menu":
                                        return <Menu menuList={menuList} menuStyle={menuStyle} />;
                                    case "filter":
                                        return <Filter dropdownList={dropdownList} searchBox={searchBox} />;
                                    case "button":
                                        return <Button buttonList={buttonList} buttonStyle={buttonStyle} />;
                                    default:
                                        return null;
                                }
                            })}
                        </div>
                    );
                })}
            </div>
        );
    } else {
        return (
            <div className={styles.container + (isMobile() ? " " + styles.mobile : "") + (className ? " " + className : "")} style={style}>
                {render.map((component) => {
                    if (component === "search") {
                        return (
                            <div
                                className={styles.search_container}
                                style={{ marginLeft: menuList ? "auto" : 0, marginRight: menuList ? 0 : "auto", ...searchStyle }}
                            >
                                <input
                                    ref={inputRef}
                                    placeholder={searchBox.placeholder}
                                    value={searchBox.value}
                                    onChange={(e) => {
                                        searchBox.onChange(e.target.value);
                                        inputRef.current.focus();
                                    }}
                                />
                                <AiOutlineSearch />
                            </div>
                        );
                    } else {
                        switch (component) {
                            case "menu":
                                return <Menu menuList={menuList} menuStyle={menuStyle} />;
                            case "dropdown":
                                return <Dropdown dropdownList={dropdownList} dropdownStyle={dropdownStyle} />;
                            case "button":
                                return <Button buttonList={buttonList} buttonStyle={buttonStyle} />;
                            default:
                                return null;
                        }
                    }
                })}
            </div>
        );
    }
};

Toolbar.propTypes = {
    render: PropTypes.arrayOf(PropTypes.oneOf(["menu", "search", "dropdown", "button"])),
    renderMobile: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOf(["menu", "search", "filter", "button"]))),
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
    searchBox: PropTypes.shape({
        label: PropTypes.string,
        placeholder: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func,
    }),
    dropdownList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string,
                    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                })
            ),
        })
    ),
    buttonList: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            onClick: PropTypes.func,
            isTransparent: PropTypes.bool,
            isHidden: PropTypes.bool,
        })
    ),
    activeMenu: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    menuStyle: PropTypes.object,
    searchStyle: PropTypes.object,
    dropdownStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
};

export default Toolbar;
