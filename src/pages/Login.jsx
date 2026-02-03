import { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let userRole = 'user'; // Default role

            if (isLogin) {
                const res = await signInWithEmailAndPassword(auth, email, password);
                // Fetch Role
                const userDoc = await getDoc(doc(db, "users", res.user.uid));
                if (userDoc.exists()) {
                    userRole = userDoc.data().role || 'user';
                }
            } else {
                const res = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(res.user, { displayName: name });
                // Create User Doc
                await setDoc(doc(db, "users", res.user.uid), {
                    email,
                    name,
                    role: role, // Use selected role
                    createdAt: new Date()
                });
                userRole = role; // Use selected role for redirection
            }

            if (userRole === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box glass-card animate-fade-in">
                <h1 className="font-heading text-gold" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    GoldenBite
                </h1>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
                    {isLogin ? 'Welcome back to luxury dining' : 'Begin your culinary journey'}
                </p>

                {error && <div style={{
                    background: 'rgba(255, 68, 68, 0.1)',
                    border: '1px solid rgba(255, 68, 68, 0.3)',
                    color: '#ff6b6b',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem'
                }}>{error}</div>}

                <form onSubmit={handleAuth}>
                    {!isLogin && (
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    )}
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="input-group">
                            <label>Account Type</label>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid #333',
                                    color: 'white',
                                    borderRadius: '12px',
                                    outline: 'none'
                                }}
                            >
                                <option value="user">USER</option>
                                <option value="admin">ADMIN</option>
                            </select>
                        </div>
                    )}

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                        {isLogin ? "New to GoldenBite? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setName('');
                                setEmail('');
                                setPassword('');
                            }}
                            className="text-gold"
                            style={{ background: 'none', fontWeight: 'bold', textDecoration: 'none' }}
                        >
                            {isLogin ? 'Join Now' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
