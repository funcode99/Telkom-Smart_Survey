import PropTypes from "prop-types";
import styles from "./ListSelector.module.scss";

const ListSelector = ({ objectKey, listData, onClick, onClose, isListLoading, isSubmitLoading, CustomElement }) => {
    return (
        <div className={styles.main_container}>
            <div className={styles.header}></div>
            <div className={styles.body}>
                {isListLoading ? (
                    <div>Loading</div>
                ) : (
                    listData?.lists?.map((data, i) => {
                        if (!listData.lists.length) {
                            return <div key={i}>List is empty!</div>;
                        } else if (CustomElement) {
                            return <CustomElement data={data} onClick={onClick} key={i} />;
                        } else {
                            return (
                                <div
                                    key={i}
                                    onClick={() => {
                                        if (!isSubmitLoading) onClick(data);
                                    }}
                                    style={{ cursor: isListLoading && "wait" }}
                                >
                                    {data[objectKey]}
                                </div>
                            );
                        }
                    })
                )}
            </div>
            <div className={styles.button}>
                <button onClick={onClose} disabled={isSubmitLoading}>
                    CLOSE
                </button>
            </div>
        </div>
    );
};

ListSelector.propTypes = {
    objectKey: PropTypes.string,
    listData: PropTypes.shape({
        lists: PropTypes.arrayOf(PropTypes.object),
        totalData: PropTypes.number,
        totalView: PropTypes.number,
    }),
    onClick: PropTypes.func,
    onClose: PropTypes.func,
    CustomElement: PropTypes.element,
    isListLoading: PropTypes.bool,
    isSubmitLoading: PropTypes.bool,
};

export default ListSelector;
