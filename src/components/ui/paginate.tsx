import ReactPaginate from 'react-paginate';

interface PaginateProps {
    handlePageClick: (event: {selected: number}) => void;
    numOfPages: number;
}

const Paginate = ({handlePageClick, numOfPages}: PaginateProps) => {
    return (
        <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={numOfPages}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
        />
    )
}

export default Paginate;