import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null); // Role, Address, etc.
    const [loading, setLoading] = useState(true);

    // Cart State
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("goldenbite_cart");
        return saved ? JSON.parse(saved) : [];
    });

    // Auth Listener
    useEffect(() => {
        let unsubscribeUserDoc;

        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Real-time listener for User Data
                const docRef = doc(db, "users", currentUser.uid);
                unsubscribeUserDoc = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        setUserData({ role: "user" }); // Default
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                });
            } else {
                setUserData(null);
                if (unsubscribeUserDoc) {
                    unsubscribeUserDoc();
                }
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeUserDoc) {
                unsubscribeUserDoc();
            }
        };
    }, []);

    // Cart Persistence
    useEffect(() => {
        localStorage.setItem("goldenbite_cart", JSON.stringify(cart));
    }, [cart]);

    // Cart Actions
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: item.quantity + delta };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const clearCart = () => setCart([]);

    const logout = () => {
        signOut(auth);
        setCart([]);
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <AppContext.Provider value={{
            user, userData, loading, logout,
            cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal
        }}>
            {!loading && children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);
