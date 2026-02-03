import { useState } from 'react';
import { useAppContext } from '../lib/context';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CreditCard, Banknote, QrCode, ArrowLeft, Check, Trash2, Plus, Minus } from 'lucide-react';

export default function Checkout() {
    const { cart, cartTotal, clearCart, user, removeFromCart, updateQuantity } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const navigate = useNavigate();

    const cgst = cartTotal * 0.025;
    const sgst = cartTotal * 0.025;
    const total = cartTotal + cgst + sgst;

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center', minHeight: '60vh' }}>
                <h2 className="font-heading text-gold" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your Cart is Empty</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Add some delicious items to get started.</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    <ArrowLeft size={18} /> Back to Menu
                </button>
            </div>
        );
    }

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to place an order!");
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "orders"), {
                userId: user.uid,
                userName: user.displayName || user.email,
                items: cart,
                total: Number(total.toFixed(2)),
                status: "pending",
                paymentMethod,
                createdAt: serverTimestamp()
            });

            clearCart();
            navigate('/my-orders');
        } catch (err) {
            alert("Error placing order: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            <div className="animate-fade-in">
                <h2 className="font-heading text-gold" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Checkout</h2>
                <form onSubmit={handlePayment}>
                    <div className="glass-card" style={{ marginBottom: '2rem' }}>
                        <h3 className="font-heading" style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Delivery Details</h3>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" defaultValue={user?.displayName} placeholder="Receiver's Name" required />
                        </div>
                        <div className="input-group">
                            <label>Shipping Address</label>
                            <input type="text" placeholder="House No, Street, City" required />
                        </div>
                        <div className="input-group">
                            <label>Phone Number</label>
                            <input type="tel" placeholder="+91 99999 99999" required />
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 className="font-heading" style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Payment Method</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                            {[
                                { id: 'card', label: 'Card', icon: <CreditCard /> },
                                { id: 'upi', label: 'UPI', icon: <QrCode /> },
                                { id: 'cod', label: 'Cash', icon: <Banknote /> }
                            ].map(method => (
                                <div
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    style={{
                                        border: `1px solid ${paymentMethod === method.id ? 'var(--gold)' : '#333'}`,
                                        background: paymentMethod === method.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                                        padding: '1.5rem 1rem',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{ color: paymentMethod === method.id ? 'var(--gold)' : 'var(--text-dim)' }}>{method.icon}</div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{method.label}</span>
                                </div>
                            ))}
                        </div>

                        {paymentMethod === 'card' && (
                            <div className="input-group animate-fade-in">
                                <label>Card Number</label>
                                <input type="text" placeholder="XXXX XXXX XXXX XXXX" required />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <div style={{ flex: 1 }}><input type="text" placeholder="MM/YY" required /></div>
                                    <div style={{ flex: 1 }}><input type="text" placeholder="CVV" required /></div>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'upi' && (
                            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '8px', marginBottom: '1rem' }}>
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=shop@upi&pn=GoldenBite&am=${total}`} alt="QR Code" />
                                <p style={{ color: 'black', marginTop: '0.5rem', fontSize: '0.9rem' }}>Scan to Pay</p>
                            </div>
                        )}

                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                            {loading ? 'Processing Order...' : `Pay ₹${total.toFixed(2)}`}
                        </button>
                    </div>
                </form>
            </div>

            <div className="glass-card animate-fade-in" style={{ height: 'fit-content' }}>
                <h3 className="font-heading text-gold" style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Order Summary</h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {cart.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem', color: 'white' }}>{item.name}</h4>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        style={{ background: 'none', color: '#ff6b6b', padding: '0 0.5rem' }}
                                        title="Remove item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2px 6px' }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            style={{ background: 'none', color: 'white', display: 'flex' }}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span style={{ fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            style={{ background: 'none', color: 'white', display: 'flex' }}
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <span style={{ fontWeight: '600', color: 'var(--gold)' }}>₹{item.price * item.quantity}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Subtotal</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-dim)' }}>CGST (2.5%)</span>
                        <span>₹{cgst.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-dim)' }}>SGST (2.5%)</span>
                        <span>₹{sgst.toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '1.2rem', color: 'var(--gold)', fontWeight: 'bold' }}>
                        <span>Total Pay</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
