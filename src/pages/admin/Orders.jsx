import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, updateDoc, doc, orderBy, query } from "firebase/firestore";

const STATUS_COLORS = {
    pending: "#eab308", // Yellow
    preparing: "#3b82f6", // Blue
    delivered: "#22c55e", // Green
    cancelled: "#ef4444"  // Red
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
        setLoading(false);
    };

    const updateStatus = async (id, newStatus) => {
        await updateDoc(doc(db, "orders", id), { status: newStatus });
        fetchOrders(); // Refresh
    };

    if (loading) return <div className="container" style={{ padding: '5rem' }}>Loading Orders...</div>;

    return (
        <div className="container" style={{ padding: "4rem 1rem" }}>
            <h2 style={{ color: "var(--gold)", marginBottom: "2rem" }}>Live Orders</h2>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                    <thead>
                        <tr style={{ background: "#222", textAlign: "left" }}>
                            <th style={{ padding: "1rem" }}>Order ID</th>
                            <th style={{ padding: "1rem" }}>User</th>
                            <th style={{ padding: "1rem" }}>Items</th>
                            <th style={{ padding: "1rem" }}>Total</th>
                            <th style={{ padding: "1rem" }}>Status</th>
                            <th style={{ padding: "1rem" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} style={{ borderBottom: "1px solid #333" }}>
                                <td style={{ padding: "1rem", fontSize: "0.8rem", color: "#888" }}>{order.id.slice(0, 8)}...</td>
                                <td style={{ padding: "1rem" }}>{order.userName || "Guest"}</td>
                                <td style={{ padding: "1rem" }}>
                                    {order.items.map((i, idx) => (
                                        <div key={idx}>{i.quantity}x {i.name}</div>
                                    ))}
                                </td>
                                <td style={{ padding: "1rem", fontWeight: "bold" }}>₹{order.total}</td>
                                <td style={{ padding: "1rem" }}>
                                    <span style={{
                                        padding: "0.3rem 0.8rem", borderRadius: "20px",
                                        background: STATUS_COLORS[order.status] || "#555", color: "black", fontWeight: "bold", fontSize: "0.8rem", textTransform: "capitalize"
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        style={{ padding: "0.5rem", borderRadius: "5px", background: "#111", color: "white", border: "1px solid #444" }}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="preparing">Preparing</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
