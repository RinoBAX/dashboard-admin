import React, { useState } from 'react';
import Sidebar from './Sidebar';
import FuturisticParticleBackground from './FuturisticParticleBackground';
import MessageModal from '../common/MessageModal';
import DashboardPage from '../../pages/DashboardPage';
import ProjectsPage from '../../pages/ProjectsPage';
import UsersPage from '../../pages/UsersPage';
import RegistrationsPage from '../../pages/RegistrationsPage';
import SubmissionsPage from '../../pages/SubmissionsPage';
import WithdrawalsPage from '../../pages/WithdrawalsPage';

const AdminLayout = () => {
    const [page, setPage] = useState('dashboard');
    const [message, setMessage] = useState(null);
    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };
    const renderPage = () => {
        const props = { showMessage };
        switch (page) {
            case 'dashboard':
                return <DashboardPage {...props} />;
            case 'projects':
                return <ProjectsPage {...props} />;
            case 'users':
                return <UsersPage {...props} />;
            case 'registrations':
                return <RegistrationsPage {...props} />;
            case 'submissions':
                return <SubmissionsPage {...props} />;
            case 'withdrawals':
                return <WithdrawalsPage {...props} />;
            default:
                return <DashboardPage {...props} />;
        }
    };

    return (
        <div className="flex h-screen bg-c-navy font-sans text-c-slate">
            {message && <MessageModal message={message} onClose={() => setMessage(null)} />}
            <Sidebar page={page} setPage={setPage} />
            <main className="flex-1 overflow-y-auto bg-c-navy relative">
                <FuturisticParticleBackground />
                <div className="p-8 relative z-10">
                    {renderPage()}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
