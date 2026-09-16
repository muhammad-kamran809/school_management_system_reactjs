import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

function Login() {
    const navigate = useNavigate();
    const { login, loading, user } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirectAfterLogin, setRedirectAfterLogin] = useState(false);

    useEffect(() => {
        if (redirectAfterLogin && user) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate, redirectAfterLogin, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await login(email, password);

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: `Welcome ${result.user?.name || 'back'}`,
                timer: 1500,
                showConfirmButton: false,
            });

            setRedirectAfterLogin(true);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: result.message,
            });
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center min-vh-100">
                <div className="col-md-5">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">
                                School Management System
                            </h2>

                            <h4 className="text-center mb-4">
                                Login
                            </h4>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Enter email"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter password"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading
                                        ? 'Logging in...'
                                        : 'Login'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;