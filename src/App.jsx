import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import StyleInjector from './styles/StyleInjector'; // Mengimpor komponen gaya
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/LoginPage';

function Main() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <AdminLayout /> : <LoginPage />;
}
function App() {
    return (
        <AuthProvider>
            <StyleInjector />
            <Main />
        </AuthProvider>
    );
}

export default App;
