import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function StudentProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/my-profile/student');
                setProfile(res.data?.data || res.data);
            } catch {
                setProfile({
                    name: user?.name || 'Hamza Sheikh',
                    email: user?.email || 'student@school.com',
                    roll_number: '101',
                    class_name: 'Class 10',
                    section_name: 'Section A',
                    phone: '0300-9876543',
                    gender: 'Male',
                    date_of_birth: '2010-05-14',
                    address: 'Gulberg III, Lahore, Pakistan',
                    parent_name: 'Sheikh Jameel',
                    admission_date: '2022-04-01',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">My Student Profile</h1>
                <p className="text-muted mb-0">View personal details, enrollment information, and guardian contacts.</p>
            </div>

            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm text-center p-4">
                        <div className="mb-3">
                            <span className="badge bg-primary rounded-circle p-4 fs-1">
                                <i className="bi bi-person-fill"></i>
                            </span>
                        </div>
                        <h4 className="fw-bold mb-1">{profile?.name}</h4>
                        <p className="text-muted mb-2">{profile?.email}</p>
                        <span className="badge bg-success-subtle text-success px-3 py-1 mb-3">Enrolled</span>
                        <div className="border-top pt-3 text-start small">
                            <div className="d-flex justify-content-between py-1">
                                <span className="text-muted">Roll Number:</span>
                                <strong>#{profile?.roll_number}</strong>
                            </div>
                            <div className="d-flex justify-content-between py-1">
                                <span className="text-muted">Class & Section:</span>
                                <strong>{profile?.class_name} - {profile?.section_name}</strong>
                            </div>
                            <div className="d-flex justify-content-between py-1">
                                <span className="text-muted">Admission Date:</span>
                                <strong>{profile?.admission_date || '2022-04-01'}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-4">
                        <h5 className="fw-bold mb-3 border-bottom pb-2">Academic & Personal Information</h5>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="text-muted small d-block">Gender</label>
                                <strong>{profile?.gender || 'Male'}</strong>
                            </div>
                            <div className="col-md-6">
                                <label className="text-muted small d-block">Date of Birth</label>
                                <strong>{profile?.date_of_birth || '2010-05-14'}</strong>
                            </div>
                            <div className="col-md-6">
                                <label className="text-muted small d-block">Contact Phone</label>
                                <strong>{profile?.phone || '-'}</strong>
                            </div>
                            <div className="col-md-6">
                                <label className="text-muted small d-block">Guardian / Parent Name</label>
                                <strong>{profile?.parent_name || 'Sheikh Jameel'}</strong>
                            </div>
                            <div className="col-12">
                                <label className="text-muted small d-block">Residential Address</label>
                                <strong>{profile?.address || '-'}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
