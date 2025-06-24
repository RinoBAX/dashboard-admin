import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const ProjectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 01-3 5.197z" /></svg>;
const ApprovalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SubmissionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const WithdrawIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

const Sidebar = ({ page, setPage }) => {
    const { logout, user } = useAuth();
    const navItems = [
        { name: 'Dashboard', icon: <HomeIcon />, page: 'dashboard', roles: ['ADMIN', 'SUPER_ADMIN'] },
        { name: 'Projects', icon: <ProjectIcon />, page: 'projects', roles: ['ADMIN', 'SUPER_ADMIN'] },
        { name: 'Users List', icon: <UserIcon />, page: 'users', roles: ['ADMIN', 'SUPER_ADMIN'] },
        { name: 'Registrations', icon: <ApprovalIcon />, page: 'registrations', roles: ['ADMIN', 'SUPER_ADMIN'] },
        { name: 'Submissions', icon: <SubmissionIcon />, page: 'submissions', roles: ['ADMIN', 'SUPER_ADMIN'] },
        { name: 'Withdrawals', icon: <WithdrawIcon />, page: 'withdrawals', roles: ['SUPER_ADMIN'] }, // Hanya untuk Super Admin
    ];
    return (
        <aside className="w-64 flex flex-col bg-c-navy/80 backdrop-blur-sm border-r border-c-lightest-navy/20 z-20">
            <div className="h-20 flex items-center justify-center border-b border-c-lightest-navy/20">
                <h1 className="text-3xl font-bold tracking-widest text-c-white uppercase" style={{ textShadow: '0 0 5px var(--c-chocolate)' }}>
                    Recehan
                </h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems
                    .filter(item => user && user.role && item.roles.includes(user.role))
                    .map(item => (
                        <button 
                            key={item.name} 
                            onClick={() => setPage(item.page)} 
                            className={`w-full flex items-center space-x-4 px-4 py-3 rounded-md transition-all duration-300 ${
                                page === item.page 
                                ? 'bg-c-chocolate/20 text-c-chocolate border-l-4 border-c-chocolate' 
                                : 'text-c-slate hover:bg-c-lightest-navy/10 hover:text-c-white'
                            }`}
                        >
                            {item.icon}
                            <span className="font-semibold tracking-wider">{item.name}</span>
                        </button>
                ))}
            </nav>
            <div className="p-4 border-t border-c-lightest-navy/20">
                <div className="px-4 py-3 mb-3 rounded bg-c-lightest-navy/10 text-center">
                    <p className="font-bold text-c-white truncate">{user?.username || 'Admin'}</p>
                    <p className="text-xs text-c-chocolate tracking-widest">{user?.role || 'ROLE'}</p>
                </div>
                <button 
                    onClick={logout} 
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-md text-c-slate bg-red-900/50 hover:bg-red-700/80 hover:text-white transition-colors duration-200"
                >
                    <LogoutIcon />
                    <span>LOGOUT</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
