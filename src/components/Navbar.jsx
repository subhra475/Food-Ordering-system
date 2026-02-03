import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useAppContext } from '../lib/context';

export default function Navbar() {
    const { user, userData, cart, logout } = useAppContext();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav style={{
            background: 'var(--card-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '1rem 1.5rem',
            position: 'sticky', top: 0,
            borderBottom: '1px solid var(--glass-border)',
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
                {/* Logo */}
                <Link to="/" className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gold)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>✨</span> GoldenBite
                </Link>

                {/* Mobile Cart & Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="mobile-only">
                    {/* Always show Cart on Mobile for easy access */}
                    <Link to="/checkout" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginRight: '0.5rem' }} className="mobile-cart">
                        <ShoppingCart size={24} style={{ color: cartCount > 0 ? 'var(--gold)' : 'inherit' }} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute', top: -8, right: -10,
                                background: 'var(--gold)', color: 'black',
                                borderRadius: '50%', width: 18, height: 18,
                                fontSize: '0.7rem', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{ background: 'none', color: 'white' }}
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/" style={{ fontWeight: '500' }}>Menu</Link>
                    {userData?.role === 'admin' && <Link to="/admin" className="text-gold">Admin Panel</Link>}

                    <Link to="/checkout" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <ShoppingCart size={24} style={{ color: cartCount > 0 ? 'var(--gold)' : 'inherit' }} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute', top: -8, right: -10,
                                background: 'var(--gold)', color: 'black',
                                borderRadius: '50%', width: 20, height: 20,
                                fontSize: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Hi, {user.displayName?.split(' ')[0] || 'Guest'}</span>
                            <Link to="/my-orders" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Orders</Link>
                            <button onClick={logout} title="Logout" style={{ background: 'none' }}><LogOut size={20} color="#ff6b6b" /></button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Login</Link>
                    )}
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="mobile-menu animate-fade-in" style={{
                    position: 'absolute',
                    top: '100%', left: 0, right: 0,
                    background: '#0A0A0A',
                    borderBottom: '1px solid var(--glass-border)',
                    padding: '1.5rem',
                    display: 'flex', flexDirection: 'column', gap: '1.5rem',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
                }}>
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>Menu</Link>
                    {userData?.role === 'admin' && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-gold">Admin Panel</Link>}

                    {user ? (
                        <>
                            <div style={{ borderTop: '1px solid #333', margin: '0.5rem 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-dim)' }}>{user.displayName}</span>
                                <button onClick={logout} style={{ background: 'none', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    Logout <LogOut size={16} />
                                </button>
                            </div>
                            <Link to="/my-orders" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--gold)' }}>My Orders</Link>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn btn-primary" style={{ textAlign: 'center' }}>Login</Link>
                    )}
                </div>
            )}

            <style>{`
                .mobile-only { display: none !important; }
                
                @media (max-width: 768px) {
                    .desktop-menu { display: none !important; }
                    .mobile-only { display: flex !important; }
                }
            `}</style>
        </nav>
    );
}
