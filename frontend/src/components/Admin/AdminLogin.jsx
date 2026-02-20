import React from 'react';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ adminCreds, setAdminCreds, handleAdminLogin, error, setError }) => {
    const navigate = useNavigate();

    return (
        <div className="admin-login-view fade-in">
            <div className="login-card">
                <div className="login-header">
                    <Lock size={32} />
                    <h1>Admin Portal</h1>
                    <p>Sign in to manage your availability</p>
                </div>
                <form onSubmit={handleAdminLogin}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={adminCreds.email}
                            onChange={e => setAdminCreds({ ...adminCreds, email: e.target.value })}
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={adminCreds.password}
                            onChange={e => setAdminCreds({ ...adminCreds, password: e.target.value })}
                            placeholder="password"
                        />
                    </div>
                    {error && <div className="error-box"><AlertCircle size={14} /> {error}</div>}
                    <button type="submit" className="btn-login">Sign In</button>
                </form>
                <button className="btn-back-user" onClick={() => { navigate('/'); setError(''); }}>
                    <ArrowLeft size={14} /> Return to Booking Site
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;
