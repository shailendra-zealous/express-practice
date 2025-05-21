
const pagination = async (page, limit, totalRecords) => {
    const pagination = {};

    const totalPages = Math.ceil(totalRecords / limit);
    pagination.totalRecords = totalRecords;
    pagination.totalPages = totalPages;
    pagination.currentPage = page;

    let paginationData = [];
    for (let i = 1; i <= totalPages; i++) {
        paginationData.push({
            label: i,
            page: i,
            active: i === page ? true : false
        })
    }
    pagination.pages = paginationData;
    return pagination;
}

module.exports = pagination