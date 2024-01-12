import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import styles from "./Filter.module.scss";

import { BiFilterAlt } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import useModal from "../../../utils/useModal";

import { Button } from "../Button";
import ModalContainer from "../../modal/ModalContainer";
import { ModalHeader as Header } from "../Header";
import Input from "../Input";
import Dropdown from "../Dropdown";

const Filter = ({ dropdownList, searchBox }) => {
    const { modal, setModal } = useModal("toolbar-filter");
    const { t } = useTranslation("common");

    return (
        <>
            <Button isTransparent className={styles.button} onClick={() => setModal(true)}>
                <BiFilterAlt />
            </Button>
            <ModalContainer show={modal} customContainer={{ padding: "1.25rem 1rem", width: "90%", maxWidth: "20.5rem", overflowY: "visible" }}>
                <Header title={t("filter_title")} close={{ onClick: () => setModal(false) }} />
                <div className={styles.modal_container}>
                    {searchBox && (
                        <Input label={searchBox.label}>
                            <div className={styles.searchbox}>
                                <input
                                    value={searchBox.value}
                                    onChange={(e) => {
                                        searchBox.onChange(e.target.value);
                                    }}
                                    placeholder={searchBox.placeholder}
                                />
                                {searchBox.value ? (
                                    <MdClose onClick={() => searchBox.onChange("")} style={{ cursor: "pointer" }} />
                                ) : (
                                    <AiOutlineSearch />
                                )}
                            </div>
                        </Input>
                    )}
                    {dropdownList.map((dropdown) => {
                        return (
                            <Input label={dropdown.label} key={dropdown.value} style={{ width: "100%" }}>
                                <Dropdown
                                    id={dropdown.id}
                                    options={dropdown.options}
                                    onSelect={(value, data) => {
                                        dropdown.onSelect(value, data);
                                    }}
                                    value={dropdown.value}
                                    style={{ height: "2.5rem", width: "100%" }}
                                    isFloating
                                />
                            </Input>
                        );
                    })}
                </div>
            </ModalContainer>
        </>
    );
};

Filter.propTypes = {
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
    searchBox: PropTypes.shape({
        label: PropTypes.string,
        placeholder: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func,
    }),
};

export default Filter;
