import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
    const { user } = useAuth();
    const chartData = [
      { name: 'Jan', submissions: 240, users: 400 },
      { name: 'Feb', submissions: 139, users: 300 },
      { name: 'Mar', submissions: 980, users: 200 },
      { name: 'Apr', submissions: 390, users: 278 },
      { name: 'May', submissions: 480, users: 189 },
      { name: 'Jun', submissions: 380, users: 239 },
    ];
    const summaryData = [
        { title: 'Total Users', value: '1,250' },
        { title: 'Pending Submissions', value: '82' },
        { title: 'Completed Projects', value: '34' }
    ];
    return (
        <div>
            <h1 className="text-5xl font-bold text-c-white uppercase tracking-wider" style={{ textShadow: '0 0 8px rgba(255,255,255,0.3)' }}>
                SYSTEM DASHBOARD
            </h1>
            <p className="text-c-chocolate mt-2 text-lg">
                STATUS: <span className="text-green-400">ONLINE</span> // OPERATOR: {user?.username || 'Admin'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {summaryData.map((item, index) => (
                    <div 
                        key={index} 
                        className="glassmorphism p-6 rounded-lg border-l-4 border-c-chocolate hover:border-c-chocolate-dark transition-all duration-300 hover:shadow-2xl hover:shadow-c-chocolate/10"
                    >
                        <h3 className="text-lg font-semibold text-c-slate uppercase tracking-widest">
                            {item.title}
                        </h3>
                        <p className="text-4xl font-bold text-c-white mt-2">
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>
            <div className="mt-8 glassmorphism p-6 rounded-lg">
                <h3 className="text-xl font-bold text-c-white mb-4 uppercase tracking-wider">
                    Monthly Activity Matrix
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(136, 146, 176, 0.2)" />
                        <XAxis dataKey="name" stroke="var(--c-slate)" />
                        <YAxis stroke="var(--c-slate)" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'var(--c-light-navy)', 
                                border: '1px solid var(--c-lightest-navy)'
                            }}
                        />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="submissions" 
                            stroke="var(--c-chocolate)" 
                            strokeWidth={2} 
                            activeDot={{ r: 8 }} 
                        />
                        <Line 
                            type="monotone" 
                            dataKey="users" 
                            stroke="var(--c-light-slate)" 
                            strokeWidth={2} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DashboardPage;
