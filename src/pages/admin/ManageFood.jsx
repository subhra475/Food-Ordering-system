import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function ManageFood() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: "", price: "", category: "pizza", image: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const querySnapshot = await getDocs(collection(db, "products"));
        setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, "products"), {
                ...form,
                price: Number(form.price)
            });
            setForm({ name: "", price: "", category: "pizza", image: "" });
            fetchProducts();
            alert("Product Added!");
        } catch (err) {
            alert("Error adding product: " + err.message);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this item?")) return;
        await deleteDoc(doc(db, "products", id));
        fetchProducts();
    };

    return (
        <div className="container" style={{ padding: "4rem 1rem" }}>
            <h2 style={{ color: "var(--gold)", marginBottom: "2rem" }}>Manage Menu</h2>

            {/* ADD FORM */}
            <div style={{ background: "var(--card-bg)", padding: "2rem", borderRadius: "12px", marginBottom: "3rem" }}>
                <h3>Add New Item</h3>
                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                    <input
                        type="text" placeholder="Item Name" required
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        style={{ padding: "0.8rem", background: "#0a0a0a", border: "1px solid #333", color: "white" }}
                    />
                    <input
                        type="number" placeholder="Price (₹)" required
                        value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                        style={{ padding: "0.8rem", background: "#0a0a0a", border: "1px solid #333", color: "white" }}
                    />
                    <select
                        value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                        style={{ padding: "0.8rem", background: "#0a0a0a", border: "1px solid #333", color: "white" }}
                    >
                        <option value="pizza">Pizza</option>
                        <option value="burger">Burger</option>
                        <option value="pasta">Pasta</option>
                        <option value="mexican">Mexican</option>
                        <option value="beverage">Beverage</option>
                    </select>
                    <input
                        type="text" placeholder="Image URL"
                        value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                        style={{ padding: "0.8rem", background: "#0a0a0a", border: "1px solid #333", color: "white" }}
                    />
                    <button className="btn btn-primary" style={{ gridColumn: "span 2" }} disabled={loading}>
                        {loading ? "Adding..." : "Add Item"}
                    </button>
                </form>
            </div>

            {/* LIST */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
                {products.map(p => (
                    <div key={p.id} style={{ background: "#111", padding: "1rem", borderRadius: "8px", border: "1px solid #333" }}>
                        <img src={p.image || "https://via.placeholder.com/150"} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "4px" }} />
                        <h4 style={{ margin: "0.5rem 0" }}>{p.name}</h4>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "var(--gold)" }}>₹{p.price}</span>
                            <button
                                onClick={() => handleDelete(p.id)}
                                style={{ background: "#d33", color: "white", padding: "0.3rem 0.8rem", borderRadius: "4px" }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
