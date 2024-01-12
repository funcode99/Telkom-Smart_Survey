import PropTypes from "prop-types";
import useModal from "../../utils/useModal.js";
import styles from "./TableList.module.scss";

const TableList = ({
    modalIdentifier,
    list,
    isLoading,
    header,
    body,
    customComponent,
    emptyComponent,
    emptyMessage,
    onClick,
    hide_action,
    style,
    isDisabled = () => true,
}) => {
    const { setData } = useModal(modalIdentifier);

    return (
        <div className={styles.container} style={style}>
            <table className={styles.table}>
                <thead className={styles.header}>
                    <tr>
                        {header.map((label) => {
                            return <th key={label}>{label}</th>;
                        })}
                        {!hide_action && <th>Action</th>}
                    </tr>
                </thead>
                <tbody className={styles.body}>
                    {customComponent || list.length ? (
                        list.map((data, index) => {
                            return (
                                <tr
                                    key={index}
                                    onClick={() => {
                                        if (!window.getSelection().isCollapsed) return;
                                        if (!isDisabled(data)) return;

                                        if (onClick) return onClick(data);
                                        setData({ ...data, index });
                                    }}
                                    className={styles.list}
                                    style={{ cursor: isDisabled && !isDisabled(data) && "default" }}
                                >
                                    {body[index].map((bodyData, i) => {
                                        const value = typeof bodyData === "object" ? bodyData.value : bodyData;

                                        return (
                                            <td key={i} style={bodyData?.style}>
                                                {value || "-"}
                                            </td>
                                        );
                                    })}
                                    {!hide_action && (
                                        <td>
                                            <button>Edit</button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={header.length + 1}>
                                <div className={styles.empty}>
                                    {isLoading ? <span>Loading</span> : emptyComponent || <span>{emptyMessage || "Data not found!"}</span>}
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

TableList.propTypes = {
    modalIdentifier: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.object),
    body: PropTypes.arrayOf(PropTypes.array),
    header: PropTypes.arrayOf(PropTypes.string),
    onClick: PropTypes.func,
    isLoading: PropTypes.bool,
    customComponent: PropTypes.node,
    emptyComponent: PropTypes.node,
    emptyMessage: PropTypes.string,
    hide_action: PropTypes.bool,
    style: PropTypes.object,
    isDisabled: PropTypes.func,
};

export default TableList;
