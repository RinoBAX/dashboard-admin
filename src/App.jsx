import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as THREE from 'three';

// --- Helper Functions & Constants ---
const API_BASE_URL = 'http://localhost:3001/api';

const ICONS = {
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    projects: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>,
    users: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    submissions: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    withdrawals: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
    logout: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    eye: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
    eyeOff: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>,
};

const LoadingComponent = () => (
    <div className="loading-overlay">
        <div className="loader"></div>
        <p>Synthesizing Data...</p>
    </div>
);

const useApi = (token) => {
    const request = useCallback(async (endpoint, method = 'GET', body = null) => {
        const url = `${API_BASE_URL}${endpoint}`;
        const options = {
            method,
            headers: { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }), },
        };
        if (body) { options.body = JSON.stringify(body); }
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (!response.ok) { throw new Error(data.message || 'An error occurred'); }
            return data;
        } catch (error) {
            console.error(`API Error on ${method} ${endpoint}:`, error);
            throw error;
        }
    }, [token]);
    return { request };
};

const LoginPage = ({ setToken, setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const api = useApi();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const data = await api.request('/auth/login', 'POST', { email, password });
            if (data.token && (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN')) {
                setToken(data.token);
                setUser(data.user);
            } else {
                setError('Login failed or role not permitted.');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="login-page">
            <div className="login-container glass-panel">
                <div className="login-header">
                    <h2>Admin BaxLancer</h2>
                    <p>Authenticate to access the <br></br><p className="login-for">Admin Dashboard</p> <br></br><p className='findSoulmate'>(Find your soulmate in user-list)</p></p>
                </div>
                <form className="login-form" onSubmit={handleLogin}>
                    {error && <div className="error-message">{error}</div>}
                    <div className="input-wrapper">
                        <input id="email-address" name="email" type="email" required className="form-input" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-wrapper">
                        <input id="password" name="password" type={showPassword ? 'text' : 'password'} required className="form-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                            {showPassword ? ICONS.eyeOff : ICONS.eye}
                        </button>
                    </div>
                    <div>
                        <button type="submit" disabled={isLoading} className="button button-primary">
                            {isLoading ? 'Authenticating...' : 'Engage'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Sidebar = ({ user, setPage, currentPage, handleLogout }) => {
    const navItems = useMemo(() => [
        { name: 'Dashboard', icon: ICONS.dashboard, page: 'dashboard', roles: ['ADMIN', 'SUPER_ADMIN'] },
        { name: 'Projects', icon: ICONS.projects, page: 'projects', roles: ['ADMIN', 'SUPER_ADMIN'] },
        { name: 'Users', icon: ICONS.users, page: 'users', roles: ['ADMIN', 'SUPER_ADMIN'] },
        { name: 'Submissions', icon: ICONS.submissions, page: 'submissions', roles: ['ADMIN', 'SUPER_ADMIN'] },
        { name: 'Withdrawals', icon: ICONS.withdrawals, page: 'withdrawals', roles: ['SUPER_ADMIN'] },
    ], []);

    return (
        <aside className="sidebar glass-panel">
            <h2 className="sidebar-header">BaxLancer Admin</h2>
            <div className="sidebar-profile">
                <img src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}&background=0d0c38&color=00f6ff`} alt="avatar" />
                <h4>{user.username}</h4>
                <p>{user.role}</p>
            </div>
            <div className="sidebar-nav">
                <nav>
                    {navItems.filter(item => item.roles.includes(user.role)).map(item => (
                        <button key={item.name} onClick={() => setPage(item.page)}
                            className={`nav-item ${currentPage === item.page ? 'nav-item-active' : ''}`}>
                            {item.icon}
                            <span>{item.name}</span>
                        </button>
                    ))}
                </nav>
                 <button onClick={handleLogout} className="nav-item logout-button">
                    {ICONS.logout}
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

const DashboardPage = () => {
    const stats = [
        { name: 'Total Users', value: '1,204', change: '+12%', changeType: 'positive' },
        { name: 'Pending Submissions', value: '82', change: '+5.4%', changeType: 'positive' },
        { name: 'Pending Withdrawals', value: '12', change: '-2.1%', changeType: 'negative' },
        { name: 'Projects Active', value: '25', change: '+2', changeType: 'positive' }
    ];

    return (
        <div>
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Welcome back! Here's a summary of the platform.</p>
            </div>
            <div className="stats-grid">
                {stats.map((stat) => (
                    <div key={stat.name} className="stat-card glass-panel">
                        <div>
                            <p>{stat.name}</p>
                            <p>{stat.value}</p>
                        </div>
                        <div className={`stat-change stat-change--${stat.changeType}`}>{stat.change} vs last month</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProjectsPage = ({ token }) => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const api = useApi(token);

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            try {
                const data = await api.request('/projects');
                setProjects(data);
            } catch (error) { console.error("Failed to fetch projects", error); } finally { setIsLoading(false); }
        };
        fetchProjects();
    }, [api]);

    if (isLoading) return <LoadingComponent />;

    return (
        <div>
            <div className="page-header"><h1>Projects</h1></div>
            <div className="table-container glass-panel">
                <table className="data-table">
                    <thead><tr><th>Name</th><th>Value</th><th>Created By</th><th>Date</th><th>Actions</th></tr></thead>
                    <tbody>
                        {projects.map(project => (
                            <tr key={project.id}>
                                <td>{project.name}</td>
                                <td>Rp {Number(project.value).toLocaleString('id-ID')}</td>
                                <td>{project.createdBy?.username || 'N/A'}</td>
                                <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                                <td className="table-actions"><button className="button button-primary" style={{width: "auto"}}>Edit</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdminSubmissionsPage = ({ token }) => {
     const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const api = useApi(token);

    const fetchSubmissions = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.request('/admin/submissions?status=PENDING');
            setSubmissions(data || []);
        } catch (error) { console.error("Failed to fetch submissions", error); } finally { setIsLoading(false); }
    }, [api]);

    useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

    const handleReview = async (id, status) => {
        try {
            await api.request(`/admin/submissions/review/${id}`, 'POST', { status });
            fetchSubmissions();
        } catch (error) { alert(`Failed to review submission: ${error.message}`); }
    };
    
    if (isLoading) return <LoadingComponent />;

    return (
        <div>
            <div className="page-header"><h1>Review Submissions</h1></div>
            <div className="table-container glass-panel">
                <table className="data-table">
                     <thead><tr><th>User</th><th>Project</th><th>Submitted At</th><th>Actions</th></tr></thead>
                    <tbody>
                        {submissions.length > 0 ? submissions.map(sub => (
                             <tr key={sub.id}>
                                <td>{sub.user?.username || 'N/A'}</td>
                                <td>{sub.project?.name || 'N/A'}</td>
                                <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                                <td className="table-actions">
                                    <button onClick={() => handleReview(sub.id, 'APPROVED')} className="button button-approve">Approve</button>
                                    <button onClick={() => handleReview(sub.id, 'REJECTED')} className="button button-reject">Reject</button>
                                </td>
                            </tr>
                        )) : ( <tr><td colSpan="4" style={{textAlign: 'center', padding: '1rem'}}>No pending submissions found.</td></tr> )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdminWithdrawalsPage = ({ token }) => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const api = useApi(token);

    const fetchWithdrawals = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.request('/admin/withdrawals?status=PENDING');
            setWithdrawals(data || []);
        } catch (error) { console.error("Failed to fetch withdrawals", error); } finally { setIsLoading(false); }
    }, [api]);
    
    useEffect(() => { fetchWithdrawals(); }, [fetchWithdrawals]);

    const handleReview = async (id, status) => {
        try {
            await api.request(`/admin/withdrawals/review/${id}`, 'POST', { status });
            fetchWithdrawals(); 
        } catch (error) { alert(`Failed to review withdrawal: ${error.message}`); }
    };

    if (isLoading) return <LoadingComponent />;

    return (
         <div>
            <div className="page-header"><h1>Review Withdrawals</h1></div>
            <div className="table-container glass-panel">
                <table className="data-table">
                     <thead><tr><th>User</th><th>Amount</th><th>Requested At</th><th>Actions</th></tr></thead>
                    <tbody>
                        {withdrawals.length > 0 ? withdrawals.map(w => (
                             <tr key={w.id}>
                                <td>{w.user?.username || 'N/A'}</td>
                                <td>Rp {Number(w.amount).toLocaleString('id-ID')}</td>
                                <td>{new Date(w.createdAt).toLocaleString()}</td>
                                <td className="table-actions">
                                    <button onClick={() => handleReview(w.id, 'APPROVED')} className="button button-approve">Approve</button>
                                    <button onClick={() => handleReview(w.id, 'REJECTED')} className="button button-reject">Reject</button>
                                </td>
                            </tr>
                        )) : ( <tr><td colSpan="4" style={{textAlign: 'center', padding: '1rem'}}>No pending withdrawals found.</td></tr> )}
                    </tbody>
                </table>
            </div>
        </div>
    )
};
const UsersPage = () => {
    return (
        <div>
            <div className="page-header"><h1>User Management</h1></div>
            <div className="placeholder-notice glass-panel">
                <p>User management functionality is pending.</p>
                <p>Requires an endpoint like <strong>/api/admin/users</strong> to fetch, search, and paginate all users.</p>
            </div>
        </div>
    )
};

function App() {
    const [token, setTokenState] = useState(() => localStorage.getItem('adminToken'));
    const [user, setUserState] = useState(() => {
        const savedUser = localStorage.getItem('adminUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [page, setPage] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(true);

    const setToken = (newToken) => {
        if (newToken) localStorage.setItem('adminToken', newToken);
        else localStorage.removeItem('adminToken');
        setTokenState(newToken);
    };

    const setUser = (newUser) => {
        if (newUser) localStorage.setItem('adminUser', JSON.stringify(newUser));
        else localStorage.removeItem('adminUser');
        setUserState(newUser);
    };

    const handleLogout = () => {
        setToken(null);
        setUser(null);
    };
    
    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                try {
                    const api = useApi(token);
                    const profileData = await api.request('/users/me');
                    if (profileData && (profileData.role === 'ADMIN' || profileData.role === 'SUPER_ADMIN')) {
                       setUser(profileData);
                    } else { handleLogout(); }
                } catch (error) {
                    console.error("Token verification failed", error);
                    handleLogout();
                }
            }
            setIsLoading(false);
        };
        verifyToken();
    }, []);

    useEffect(() => {
        let scene, camera, renderer, crystal;
        const canvas = document.getElementById('bg-canvas');

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);

            const geometry = new THREE.IcosahedronGeometry(2, 0);
            const material = new THREE.MeshStandardMaterial({
                color: 0x8A2BE2,
                transparent: true,
                opacity: 0.3,
                roughness: 0.1,
                metalness: 0.8,
            });
            crystal = new THREE.Mesh(geometry, material);
            scene.add(crystal);

            const pointLight = new THREE.PointLight(0x00f6ff, 2, 100);
            pointLight.position.set(10, 10, 10);
            scene.add(pointLight);
            
            const ambientLight = new THREE.AmbientLight(0xff007f, 0.5);
            scene.add(ambientLight);

            camera.position.z = 5;

            animate();
        }

        function animate() {
            requestAnimationFrame(animate);
            if(crystal) {
                crystal.rotation.x += 0.001;
                crystal.rotation.y += 0.001;
            }
            renderer.render(scene, camera);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', onWindowResize, false);
        init();

        return () => {
            window.removeEventListener('resize', onWindowResize);
        };
    }, []);
    
    const renderPage = () => {
        switch (page) {
            case 'dashboard': return <DashboardPage />;
            case 'projects': return <ProjectsPage token={token} />;
            case 'users': return <UsersPage />;
            case 'submissions': return <AdminSubmissionsPage token={token} />;
            case 'withdrawals': return <AdminWithdrawalsPage token={token} />;
            default: return <DashboardPage />;
        }
    };
    
    if (isLoading) { return <LoadingComponent />; }
    if (!token || !user) { return <LoginPage setToken={setToken} setUser={setUser} />; }

    return (
        <div className="app-layout">
            <Sidebar user={user} setPage={setPage} currentPage={page} handleLogout={handleLogout} />
            <main className="main-content">{renderPage()}</main>
        </div>
    );
}

export default App;
