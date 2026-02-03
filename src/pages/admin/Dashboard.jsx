import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Package, CheckCircle, Clock, XCircle, ChevronRight, IndianRupee } from 'lucide-react';

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch ALL orders ordered by date
        const q = query(
            collection(db, "orders"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        if (!confirm(`Mark order as ${newStatus}?`)) return;
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { status: newStatus });
        } catch (error) {
            alert("Error updating status: " + error.message);
        }
    };

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        revenue: orders.reduce((sum, o) => sum + (o.total || 0), 0)
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1 className="font-heading text-gold" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
                Admin Dashboard
            </h1>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-card">
                    <h3 style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Revenue</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gold)', display: 'flex', alignItems: 'center' }}>
                        <IndianRupee size={28} /> {stats.revenue.toLocaleString()}
                    </div>
                </div>
                <div className="glass-card">
                    <h3 style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Pending Orders</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'orange' }}>
                        {stats.pending}
                    </div>
                </div>
                <div className="glass-card">
                    <h3 style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Orders</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {stats.total}
                    </div>
                </div>
            </div>

            <h2 className="font-heading" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Live Orders</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {orders.map(order => (
                        <div key={order.id} className="glass-card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
                            {/* Header */}
                            <div style={{
                                padding: '1rem 1.5rem',
                                background: 'rgba(255,255,255,0.05)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                flexWrap: 'wrap', gap: '1rem'
                            }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', color: 'var(--gold)' }}>#{order.id.slice(0, 6)}</span>
                                    <span style={{ margin: '0 0.5rem', color: '#555' }}>•</span>
                                    <span>{order.userName}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{
                                        padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase',
                                        background: order.status === 'pending' ? 'rgba(255, 165, 0, 0.2)' :
                                            order.status === 'delivered' ? 'rgba(76, 217, 100, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                        color: order.status === 'pending' ? 'orange' :
                                            order.status === 'delivered' ? '#4cd964' : 'white'
                                    }}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Body */}
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                            <span>
                                                <span style={{ color: 'var(--text-dim)', marginRight: '8px' }}>{item.quantity}x</span>
                                                {item.name}
                                            </span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: '1rem'
                                }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--gold)' }}>
                                        Total: ₹{order.total}
                                    </span>

                                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                                        {order.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(order.id, 'cancelled')}
                                                    className="btn"
                                                    style={{ background: 'rgba(255, 68, 68, 0.15)', color: '#ff6b6b', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(order.id, 'preparing')}
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}
                                                >
                                                    Accept & Cook
                                                </button>
                                            </>
                                        )}

                                        {order.status === 'preparing' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'out_for_delivery')}
                                                className="btn btn-outline"
                                                style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}
                                            >
                                                Send for Delivery
                                            </button>
                                        )}

                                        {order.status === 'out_for_delivery' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'delivered')}
                                                className="btn btn-primary"
                                                style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', background: '#4cd964', color: 'black' }}
                                            >
                                                Mark Delivered
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
