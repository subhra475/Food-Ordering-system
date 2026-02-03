import { useState, useEffect } from 'react';
import { useAppContext } from '../lib/context';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Plus, Minus, ShoppingBag, Star, ChefHat, Search, Filter } from 'lucide-react';

const DUMMY_PRODUCTS = [
    {
        id: 'i1',
        name: 'Hyderabadi Chicken Biryani',
        price: 350,
        category: 'biryani',
        restaurant: 'Royal Palace',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=2000&auto=format&fit=crop',
        rating: 4.9,
        description: 'Aromatic basmati rice cooked with tender chicken and authentic spices.'
    },
    {
        id: 'i2',
        name: 'Butter Chicken & Naan',
        price: 420,
        category: 'north indian',
        restaurant: 'Punjab Grill',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2070&auto=format&fit=crop',
        rating: 4.8,
        description: 'Creamy tomato curry with succulent chicken pieces, served with butter naan.'
    },
    {
        id: 'i3',
        name: 'Masala Dosa',
        price: 180,
        category: 'south indian',
        restaurant: 'Madras Café',
        image: '/images/masala-dosa.jpg',
        rating: 4.7,
        description: 'Crispy rice crepe filled with spiced potato mash, served with coconut chutney.'
    },
    {
        id: 'i4',
        name: 'Paneer Tikka Masala',
        price: 320,
        category: 'north indian',
        restaurant: 'Spice Route',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1974&auto=format&fit=crop',
        rating: 4.6,
        description: 'Grilled cottage cheese cubes in a rich and spicy gravy.'
    },
    {
        id: 'i5',
        name: 'Chole Bhature',
        price: 220,
        category: 'north indian',
        restaurant: 'Delhi Heights',
        image: '/images/chole-bhature.jpg',
        rating: 4.8,
        description: 'Spicy chickpea curry paired with fluffy deep-fried bread.'
    },
    {
        id: 'i6',
        name: 'Tandoori Chicken',
        price: 450,
        category: 'starters',
        restaurant: 'BBQ Nation',
        image: '/images/tandoori-chicken.jpg',
        rating: 4.7,
        description: 'Chicken marinated in yogurt and spices, roasted to perfection in a tandoor.'
    },
    {
        id: 'i7',
        name: 'Pani Puri Platter',
        price: 120,
        category: 'street food',
        restaurant: 'Street Chat Corner',
        image: '/images/pani-puri-platter.jpg',
        rating: 4.9,
        description: 'Crispy hollow puris filled with spicy tangy water and potatoes.'
    },
    {
        id: 'i8',
        name: 'Dal Makhani',
        price: 280,
        category: 'north indian',
        restaurant: 'Pind Balluchi',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=2070&auto=format&fit=crop',
        rating: 4.7,
        description: 'Whole black lentils cooked with butter and cream for hours.'
    },
    {
        id: 'i9',
        name: 'Idli Sambar',
        price: 150,
        category: 'south indian',
        restaurant: 'Saravana Bhavan',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop',
        rating: 4.5,
        description: 'Steamed rice cakes served with lentil soup and chutney.'
    },
    {
        id: 'i10',
        name: 'Gulab Jamun',
        price: 140,
        category: 'dessert',
        restaurant: 'Sweet Tooth',
        image: '/images/gulab-jamun.jpg',
        rating: 4.9,
        description: 'Fried dough balls soaked in sweet aromatic sugar syrup.'
    },
    {
        id: 'i11',
        name: 'Samosa (2 pcs)',
        price: 60,
        category: 'street food',
        restaurant: 'Snack Point',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop',
        rating: 4.6,
        description: 'Crispy pastry filled with spiced potatoes and peas.'
    },
    {
        id: 'i12',
        name: 'Kashmiri Rogan Josh',
        price: 480,
        category: 'north indian',
        restaurant: 'Kashmir Delight',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2071&auto=format&fit=crop',
        rating: 4.8,
        description: 'Aromatic lamb curry cooked with Kashmiri spices.'
    }
];

export default function Home() {
    const { addToCart, updateQuantity, cart } = useAppContext();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState(DUMMY_PRODUCTS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "products"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                // If DB has products, prefer them, or mix them. 
                // For this demo request, we strictly want the Indian items unless DB overrides.
                // UNCOMMENT below to prioritize DB
                // setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesCategory = filter === 'all' || p.category === filter;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.restaurant?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getCartItem = (id) => cart.find(item => item.id === id);

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                position: 'relative',
                height: '70vh',
                background: `linear-gradient(to bottom, transparent, var(--dark)), linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop') center/cover fixed`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                marginBottom: '3rem'
            }}>
                <div className="container animate-fade-in" style={{ zIndex: 2 }}>
                    <div style={{
                        border: '1px solid var(--gold)',
                        display: 'inline-block',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '50px',
                        marginBottom: '1rem',
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(4px)',
                        color: 'var(--gold)',
                        fontWeight: '600',
                        letterSpacing: '1px'
                    }}>
                        AUTHENTIC INDIAN CUISINE
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        color: 'var(--text)',
                        fontFamily: 'Playfair Display',
                        textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                        marginBottom: '1rem'
                    }}>
                        Spices of <span className="text-gold">India</span>
                    </h1>
                    <div style={{ position: 'relative', maxWidth: '500px', margin: '2rem auto 0' }}>
                        <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                        <input
                            type="text"
                            placeholder="Search Biryani, Dosa, Paneer..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: '50px',
                                border: 'none',
                                background: 'rgba(255,255,255,0.95)',
                                color: 'black',
                                fontSize: '1rem',
                                boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div id="menu" className="container" style={{ paddingBottom: '5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 className="font-heading text-gold" style={{ fontSize: '2.5rem' }}>Our Menu</h2>

                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        overflowX: 'auto',
                        paddingBottom: '1rem',
                        MsOverflowStyle: 'none',  /* IE and Edge */
                        scrollbarWidth: 'none',  /* Firefox */
                        WebkitOverflowScrolling: 'touch'
                    }}>
                        <style>{`
                            div::-webkit-scrollbar { display: none; }
                        `}</style>
                        {['all', 'north indian', 'south indian', 'biryani', 'street food', 'dessert'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={filter === cat ? 'btn btn-primary' : 'btn btn-outline'}
                                style={{
                                    textTransform: 'capitalize',
                                    padding: '0.6rem 1.8rem',
                                    borderRadius: '50px',
                                    fontSize: '0.95rem',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0  /* Prevent shrinking */
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--gold)' }}>
                        User preparing delicious dishes...
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {filteredProducts.length === 0 && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }} className="glass-card">
                                <p style={{ fontSize: '1.2rem' }}>No dishes found matching your criteria.</p>
                            </div>
                        )}

                        {filteredProducts.map(product => {
                            const cartItem = getCartItem(product.id);

                            return (
                                <div key={product.id} className="glass-card" style={{
                                    padding: '0',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    background: 'rgba(30,30,30,0.5)'
                                }}>
                                    <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.5s ease'
                                            }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                        <div style={{
                                            position: 'absolute', top: '15px', left: '15px',
                                            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
                                            padding: '0.4rem 1rem', borderRadius: '50px',
                                            color: '#fff', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px',
                                            border: '1px solid rgba(212, 175, 55, 0.3)'
                                        }}>
                                            <ChefHat size={14} className="text-gold" />
                                            {product.restaurant}
                                        </div>
                                        <div style={{
                                            position: 'absolute', bottom: '15px', right: '15px',
                                            background: 'var(--gold)',
                                            padding: '0.4rem 1rem', borderRadius: '50px',
                                            color: 'black', fontWeight: 'bold',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                        }}>
                                            ₹{product.price}
                                        </div>
                                    </div>

                                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <h3 className="font-heading" style={{ fontSize: '1.4rem', lineHeight: '1.2' }}>{product.name}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,165,0,0.2)', padding: '0.2rem 0.5rem', borderRadius: '8px' }}>
                                                <Star size={14} fill="orange" color="orange" />
                                                <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>{product.rating}</span>
                                            </div>
                                        </div>

                                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, lineHeight: '1.6' }}>
                                            {product.description}
                                        </p>

                                        {cartItem ? (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                background: 'rgba(212, 175, 55, 0.1)',
                                                borderRadius: '50px',
                                                padding: '0.5rem 0.8rem',
                                                border: '1px solid rgba(212, 175, 55, 0.3)'
                                            }}>
                                                <button
                                                    onClick={() => updateQuantity(product.id, -1)}
                                                    className="btn-primary"
                                                    style={{
                                                        width: '36px', height: '36px',
                                                        borderRadius: '50%', padding: 0,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        minWidth: '36px'
                                                    }}
                                                >
                                                    <Minus size={18} />
                                                </button>
                                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--gold)' }}>{cartItem.quantity}</span>
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    className="btn-primary"
                                                    style={{
                                                        width: '36px', height: '36px',
                                                        borderRadius: '50%', padding: 0,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        minWidth: '36px'
                                                    }}
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="btn btn-primary"
                                                style={{ width: '100%', borderRadius: '50px', display: 'flex', justifyContent: 'center', gap: '8px' }}
                                                onClick={() => addToCart(product)}
                                            >
                                                Add to Cart <ShoppingBag size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
