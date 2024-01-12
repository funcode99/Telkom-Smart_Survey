import dynamic from "next/dynamic";
import PropTypes from "prop-types";
// import ReactPaginate from "react-paginate";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import styles from "./Pagination.module.scss";

const ReactPaginate = dynamic(() => import("react-paginate"), { ssr: false });

const Pagination = ({ count, page, setPage, row = 10, style, className }) => {
    return (
        <div className={styles.pagination_container} style={style}>
            <ReactPaginate
                previousLabel={<MdNavigateBefore />}
                nextLabel={<MdNavigateNext />}
                breakLabel={"..."}
                forcePage={page - 1 || 0}
                breakClassName={"break-me"}
                pageCount={count ? Math.ceil(count / row) : 1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={(data) => {
                    setPage(data.selected + 1);
                }}
                containerClassName={styles.pagination + (className ? " " + className : "")}
                subContainerClassName={"pages pagination"}
                activeClassName={styles.active}
            />
        </div>
    );
};

Pagination.propTypes = {
    count: PropTypes.number,
    page: PropTypes.number,
    setPage: PropTypes.func,
    row: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string,
};

export default Pagination;
