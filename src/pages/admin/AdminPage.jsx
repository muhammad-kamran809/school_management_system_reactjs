function AdminPage({ title, icon }) {
    return (
        <div className="admin-page">
            <section className="dashboard-hero">
                <div>
                    <p className="section-kicker">School administration</p>
                    <h1>{title}</h1>
                    <p className="hero-copy">Manage your school&apos;s {title.toLowerCase()} from this workspace.</p>
                </div>
            </section>

            <div className="dashboard-panel admin-page-placeholder">
                <div className="admin-page-placeholder-icon">
                    <i className={`bi ${icon}`} aria-hidden="true"></i>
                </div>
                <div>
                    <h2>{title}</h2>
                    <p>This section is ready for your {title.toLowerCase()} records and actions.</p>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;