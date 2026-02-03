import { Navigate } from 'react-router-dom';
import { useAppContext } from '../lib/context';

export default function ProtectedRoute({ children, role }) {
    const { user, userData, loading } = useAppContext();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    if (role && userData?.role !== role) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Access Denied. Admins only.</div>;
    }

    return children;
}
