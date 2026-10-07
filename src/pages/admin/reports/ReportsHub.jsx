import { useState } from 'react';

export default function ReportsHub({ reportType = 'student', title = 'Reports' }) {
    const [selectedYear, setSelectedYear] = useState('2026-2027');
    const [selectedClass, setSelectedClass] = useState('All');

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h1 className="h3 fw-bold mb-1">{title}</h1>
                    <p className="text-muted mb-0">Generate, view, and export detailed institutional reports.</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={handlePrint}>
                        <i className="bi bi-printer"></i>
                        Print Report
                    </button>
                    <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => alert('Exporting CSV...')}>
                        <i className="bi bi-download"></i>
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Academic Year</label>
                            <select
                                className="form-select"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="2026-2027">2026-2027</option>
                                <option value="2025-2026">2025-2026</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-semibold">Class Filter</label>
                            <select
                                className="form-select"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="All">All Classes</option>
                                <option value="Class 9">Class 9</option>
                                <option value="Class 10">Class 10</option>
                            </select>
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <button className="btn btn-secondary w-100">
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Refresh Report Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Content */}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    {reportType === 'student' && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Roll #</th>
                                        <th>Student Name</th>
                                        <th>Class</th>
                                        <th>Section</th>
                                        <th>Enrollment Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>#101</td><td className="fw-semibold">Ali Khan</td><td>Class 9</td><td>Section A</td><td>2026-04-01</td><td><span className="badge bg-success-subtle text-success">Active</span></td></tr>
                                    <tr><td>#102</td><td className="fw-semibold">Fatima Noor</td><td>Class 9</td><td>Section A</td><td>2026-04-01</td><td><span className="badge bg-success-subtle text-success">Active</span></td></tr>
                                    <tr><td>#103</td><td className="fw-semibold">Bilal Tariq</td><td>Class 10</td><td>Section B</td><td>2026-04-01</td><td><span className="badge bg-success-subtle text-success">Active</span></td></tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {reportType === 'attendance' && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Class</th>
                                        <th>Total Students</th>
                                        <th>Present Count</th>
                                        <th>Absent Count</th>
                                        <th>Attendance %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td className="fw-semibold">Class 9 - Section A</td><td>35</td><td>32</td><td>3</td><td><strong className="text-success">91.4%</strong></td></tr>
                                    <tr><td className="fw-semibold">Class 10 - Section B</td><td>30</td><td>28</td><td>2</td><td><strong className="text-success">93.3%</strong></td></tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {reportType === 'fee' && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Fee Category</th>
                                        <th>Total Invoiced</th>
                                        <th>Collected</th>
                                        <th>Pending Balance</th>
                                        <th>Recovery Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td className="fw-semibold">Monthly Tuition</td><td>Rs. 850,000</td><td className="text-success fw-bold">Rs. 720,000</td><td className="text-danger fw-bold">Rs. 130,000</td><td>84.7%</td></tr>
                                    <tr><td className="fw-semibold">Annual Examination</td><td>Rs. 150,000</td><td className="text-success fw-bold">Rs. 140,000</td><td className="text-danger fw-bold">Rs. 10,000</td><td>93.3%</td></tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {reportType === 'result' && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Exam Name</th>
                                        <th>Class</th>
                                        <th>Total Appeared</th>
                                        <th>Passed</th>
                                        <th>Failed</th>
                                        <th>Pass Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td className="fw-semibold">Mid Term 2026</td><td>Class 9</td><td>35</td><td>33</td><td>2</td><td><strong className="text-success">94.2%</strong></td></tr>
                                    <tr><td className="fw-semibold">Mid Term 2026</td><td>Class 10</td><td>30</td><td>29</td><td>1</td><td><strong className="text-success">96.6%</strong></td></tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
