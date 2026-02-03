# GoldenBite - Premium Food Ordering System

GoldenBite is a luxurious, responsive food ordering application built with modern web technologies. It offers a seamless experience for users to browse a curated menu of authentic Indian cuisine, manage their cart, and place orders. It also features a protected Admin Panel for managing orders and menu items.

## 🚀 Features

### **User Features**
*   **Browsing**: View high-quality images and descriptions of food items including North Indian, South Indian, Biryani, Street Food, and Desserts.
*   **Searching & Filtering**: Easily find dishes by name or category (e.g., Starters, Dessert).
*   **Cart Management**: Add items, adjust quantities, and remove items from the cart.
*   **Authentication**: Secure SignUp and Login using Firebase Auth.
*   **Checkout**: Simple checkout process with multiple payment method UI (Card, UPI, Cash).
*   **Responsive Design**: optimized for both desktop and mobile devices.

### **Admin Features**
*   **Dashboard**: Overview of restaurant performance.
*   **Order Management**: View and update status of customer orders.
*   **Protected Routes**: Role-based access control ensuring only admins can access the backend panel.

## 🛠️ Tech Stack

*   **Frontend**: [React.js](https://react.dev/) (v19)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: Pure CSS with Glassmorphism aesthetic & CSS Variables.
*   **Routing**: [React Router DOM](https://reactrouter.com/) (v7)
*   **Backend / Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore, Hosting)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **PWA**: Configured with `vite-plugin-pwa` for installability.

## ⚙️ Installation & Local Development

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/food-ordering-system.git
    cd food-ordering-system
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    *   Create a project in the [Firebase Console](https://console.firebase.google.com/).
    *   Enable **Authentication** (Email/Password).
    *   Enable **Firestore Database**.
    *   Create a file `src/lib/firebase.js` and add your Firebase configuration object.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The app will reside at `http://localhost:5173` (or similar).

## 📦 Building and Deployment

This project is configured for **Firebase Hosting**.

1.  **Build the project:**
    ```bash
    npm run build
    ```
    This creates a production-ready `dist` folder.

2.  **Deploy to Firebase:**
    ```bash
    npm install -g firebase-tools
    firebase login
    firebase init
    firebase deploy
    ```

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components (Navbar, ProtectedRoute)
├── lib/           # Firebase configuration and Context API
├── pages/         # Page components (Home, Login, Checkout, Admin)
├── assets/        # Static assets
├── App.jsx        # Main application component & Routing
├── index.css      # Global styles & Design tokens
└── main.jsx       # Application entry point
```

## 📸 Screenshots

*Include screenshots of your Home page, Cart, and Admin Dashboard here.*

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
