import { useEffect, useState } from 'react';
import { useAppContext } from '../lib/context';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Clock, CheckCircle, Package } from 'lucide-react';

export default function UserOrders() {
    const { user } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "orders"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Client-side sort to avoid composite index requirement
            fetchedOrders.sort((a, b) => {
                const dateA = a.createdAt?.seconds || 0;
                const dateB = b.createdAt?.seconds || 0;
                return dateB - dateA;
            });
            setOrders(fetchedOrders);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching orders:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (!user) return (
        <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>
            <h2 className="font-heading text-gold">Please login to view orders</h2>
        </div>
    );

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <h1 className="font-heading text-gold" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                Your Order History
            </h1>

            {loading ? (
                <p className="text-center text-gold">Loading Orders...</p>
            ) : orders.length === 0 ? (
                <div className="glass-card text-center" style={{ padding: '3rem' }}>
                    <Package size={48} color="var(--gold)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                    <p style={{ fontSize: '1.2rem' }}>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map(order => (
                        <div key={order.id} className="glass-card animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{
                                padding: '1rem 1.5rem',
                                background: 'rgba(212, 175, 55, 0.05)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                borderBottom: '1px solid var(--glass-border)'
                            }}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    {order.status === 'pending' ? <Clock size={16} color="orange" /> : <CheckCircle size={16} color="#4cd964" />}
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: order.status === 'pending' ? 'orange' : '#4cd964',
                                        textTransform: 'uppercase', fontSize: '0.9rem'
                                    }}>
                                        {order.status}
                                    </span>
                                </div>
                                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                                    {order.createdAt?.toDate().toLocaleString()}
                                </span>
                            </div>

                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.95rem' }}>
                                            <span style={{ color: '#eee' }}>
                                                <span style={{ color: 'var(--gold)', fontWeight: 'bold', marginRight: '8px' }}>{item.quantity}x</span>
                                                {item.name}
                                            </span>
                                            <span style={{ color: 'var(--text-dim)' }}>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    paddingTop: '1rem',
                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                                        Paid via <span style={{ color: 'var(--gold)', textTransform: 'capitalize' }}>{order.paymentMethod || 'Card'}</span>
                                    </span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--gold)' }}>
                                        Total: ₹{order.total}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
