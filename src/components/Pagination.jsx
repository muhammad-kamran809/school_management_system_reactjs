export default function Pagination({
    currentPage = 1,
    lastPage = 1,
    total = 0,
    perPage = 10,
    onPageChange,
    onPerPageChange,
    from,
    to,
    itemName = 'records',
    loading = false,
}) {
    if (total === 0 && lastPage <= 1) {
        return null;
    }

    const calculatedFrom = from ?? (total > 0 ? (currentPage - 1) * perPage + 1 : 0);
    const calculatedTo = to ?? Math.min(currentPage * perPage, total);

    // Build page numbers array with ellipsis
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= lastPage; i++) {
            if (i === 1 || i === lastPage || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    const pages = getPageNumbers();

    return (
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3 border-top bg-light-subtle">
            {/* Left: Summary text and per-page selector */}
            <div className="d-flex align-items-center gap-3">
                <span className="text-muted small">
                    Showing <strong className="text-dark">{calculatedFrom}</strong> to{' '}
                    <strong className="text-dark">{calculatedTo}</strong> of{' '}
                    <strong className="text-dark">{total}</strong> {itemName}
                </span>

                {onPerPageChange && (
                    <div className="d-flex align-items-center gap-1">
                        <small className="text-muted">Per page:</small>
                        <select
                            className="form-select form-select-sm"
                            style={{ width: '75px' }}
                            value={perPage}
                            disabled={loading}
                            onChange={(e) => onPerPageChange(Number(e.target.value))}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Right: Pagination buttons */}
            {lastPage > 1 && (
                <nav aria-label="Table pagination">
                    <ul className="pagination pagination-sm mb-0">
                        {/* First Button */}
                        <li className={`page-item ${currentPage === 1 || loading ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => onPageChange(1)}
                                aria-label="First page"
                                title="First page"
                                disabled={currentPage === 1 || loading}
                            >
                                <i className="bi bi-chevron-double-left"></i>
                            </button>
                        </li>

                        {/* Prev Button */}
                        <li className={`page-item ${currentPage === 1 || loading ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => onPageChange(currentPage - 1)}
                                aria-label="Previous"
                                disabled={currentPage === 1 || loading}
                            >
                                <i className="bi bi-chevron-left me-1"></i> Prev
                            </button>
                        </li>

                        {/* Page Numbers */}
                        {pages.map((p, index) => {
                            if (p === '...') {
                                return (
                                    <li key={`ellipsis-${index}`} className="page-item disabled">
                                        <span className="page-link">…</span>
                                    </li>
                                );
                            }

                            return (
                                <li
                                    key={`page-${p}`}
                                    className={`page-item ${p === currentPage ? 'active' : ''} ${loading ? 'disabled' : ''}`}
                                >
                                    <button
                                        className="page-link fw-semibold"
                                        onClick={() => onPageChange(p)}
                                        disabled={loading}
                                    >
                                        {p}
                                    </button>
                                </li>
                            );
                        })}

                        {/* Next Button */}
                        <li className={`page-item ${currentPage === lastPage || loading ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => onPageChange(currentPage + 1)}
                                aria-label="Next"
                                disabled={currentPage === lastPage || loading}
                            >
                                Next <i className="bi bi-chevron-right ms-1"></i>
                            </button>
                        </li>

                        {/* Last Button */}
                        <li className={`page-item ${currentPage === lastPage || loading ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => onPageChange(lastPage)}
                                aria-label="Last page"
                                title="Last page"
                                disabled={currentPage === lastPage || loading}
                            >
                                <i className="bi bi-chevron-double-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}
