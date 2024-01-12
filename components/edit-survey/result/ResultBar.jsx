import PropTypes from "prop-types";
import styles from "./ResultBar.module.scss";

import Dropdown from "../../global/Dropdown";
import Pagination from "../../global/Pagination";

const ResultBar = ({ totalData, page, setPage, sort, setSort, t }) => {
    const options = [
        { label: t("sort_newest"), value: "newest" },
        { label: t("sort_oldest"), value: "oldest" },
    ];

    return (
        <div className={styles.container}>
            <label className={styles.total_result}>
                <b>{totalData} </b>
                {t("result")}
            </label>
            <div className={styles.dropdown}>
                <Dropdown id="dropdown-result-sort" options={options} onSelect={(e) => setSort(e)} value={sort} style={{ height: "2.25rem" }} />
            </div>
            <div className={styles.pagination}>
                <Pagination
                    count={totalData}
                    page={page}
                    setPage={(new_page) => setPage(new_page)}
                    row={2}
                    style={{ margin: 0 }}
                    className={styles.border}
                />
            </div>
        </div>
    );
};

ResultBar.propTypes = {
    totalData: PropTypes.number,
    page: PropTypes.number,
    setPage: PropTypes.func,
    sort: PropTypes.string,
    setSort: PropTypes.func,
    t: PropTypes.func,
};

export default ResultBar;
