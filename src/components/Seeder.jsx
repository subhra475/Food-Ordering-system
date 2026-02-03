import { useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const SAMPLE_ITEMS = [
    { name: "Margherita Pizza", price: 299, category: "pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002" },
    { name: "Double Cheeseburger", price: 249, category: "burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
    { name: "Creamy Pasta", price: 349, category: "pasta", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9" },
    { name: "Spicy Tacos", price: 199, category: "mexican", image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b" }
];

export default function Seeder() {
    useEffect(() => {
        const seed = async () => {
            const col = collection(db, "products");
            const snap = await getDocs(col);
            if (snap.empty) {
                console.log("Seeding Database...");
                for (const item of SAMPLE_ITEMS) {
                    await addDoc(col, item);
                }
                alert("Database Seeded with Sample Food!");
            }
        };
        seed();
    }, []);
    return null;
}
