import { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import TopScroll from "./components/TopScroll";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Product from "./pages/Product";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";
import Footer from "./components/Footer";
import Category from "./pages/Category";
import Discount from "./pages/Discount";
import NotFound from "./pages/NotFound";
import Magazalar from "./pages/Magazalar";
import Iletisim from "./pages/Iletisim";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import Siparislerim from "./pages/Siparislerim";
import MesafeliSatis from "./pages/MesafeliSatis";
import Gizlilik from "./pages/Gizlilik";
import Cantalar from "./pages/Cantalar";
import YeniUrunler from "./pages/YeniUrunler";
import OneCikanUrunler from "./pages/OneCikanUrunler";
import { API_URL } from "./config";

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return storedUser && token ? JSON.parse(storedUser) : null;
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    actionLabel: "",
    actionTo: "",
  });

  const [favoriteIds, setFavoriteIds] = useState(new Set());

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* =======================
     FAVORİLER
  ======================= */
  const fetchFavorites = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFavoriteIds(new Set());
      return;
    }

    fetch(`${API_URL}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setFavoriteIds(new Set(list.map((p) => p.id)));
      })
      .catch(() => setFavoriteIds(new Set()));
  }, []);

  useEffect(() => {
    if (user) fetchFavorites();
    else setFavoriteIds(new Set());
  }, [user, fetchFavorites]);

  /* =======================
     SEPET
  ======================= */
  const addToCart = (product) => {
    // 🔥 TEK VE DOĞRU YERDE DÖNÜŞÜM
    const size =
      product.selectedSize !== undefined
        ? product.selectedSize
        : (product.size ?? null);

    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === product.id && (i.size ?? null) === size,
      );

      if (existing) {
        return prev.map((i) =>
          i.id === product.id && (i.size ?? null) === size
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }

      return [
        ...prev,
        {
          ...product,
          size,
          quantity: 1,
        },
      ];
    });
  };

  const addToCartWithToast = (product) => {
    addToCart(product);
    setToast({
      show: true,
      message: "Sepete eklendi",
      actionLabel: "Sepete Git",
      actionTo: "/cart",
    });
  };

  const updateQuantity = (productId, quantity, size = null) => {
    if (quantity < 1) {
      removeFromCart(productId, size);
      return;
    }

    setCart((prev) =>
      prev.map((i) =>
        i.id === productId && (i.size ?? null) === (size ?? null)
          ? { ...i, quantity }
          : i,
      ),
    );
  };

  const removeFromCart = (productId, size = null) => {
    setCart((prev) =>
      prev.filter(
        (i) => !(i.id === productId && (i.size ?? null) === (size ?? null)),
      ),
    );
  };

  const changeCartItemSize = (productId, oldSize, newSize) => {
    setCart((prev) => {
      const currentItem = prev.find(
        (i) => i.id === productId && (i.size ?? null) === (oldSize ?? null),
      );

      if (!currentItem) return prev;

      const existingTarget = prev.find(
        (i) => i.id === productId && i.size === newSize,
      );

      if (existingTarget) {
        return prev
          .map((i) =>
            i.id === productId && i.size === newSize
              ? { ...i, quantity: i.quantity + currentItem.quantity }
              : i,
          )
          .filter(
            (i) =>
              !(i.id === productId && (i.size ?? null) === (oldSize ?? null)),
          );
      }

      return prev.map((i) =>
        i.id === productId && (i.size ?? null) === (oldSize ?? null)
          ? { ...i, size: newSize }
          : i,
      );
    });
  };

  /* =======================
     FAVORİ TOGGLE
  ======================= */
  const toggleFavorite = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const isFav = favoriteIds.has(productId);
    const method = isFav ? "DELETE" : "POST";
    const url = isFav
      ? `${API_URL}/favorites/${productId}`
      : `${API_URL}/favorites`;
    const body = isFav ? undefined : JSON.stringify({ productId });

    try {
      const res = await fetch(url, {
        method,
        headers: isFav
          ? { Authorization: `Bearer ${token}` }
          : {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
        body,
      });

      if (res.ok) {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          isFav ? next.delete(productId) : next.add(productId);
          return next;
        });
      }
    } catch {}
  };

  return (

    
    <div>
      
      <Navbar cart={cart} user={user} setUser={setUser} setCart={setCart} />
      <TopScroll />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              addToCart={addToCartWithToast}
              favoriteIds={favoriteIds}
              toggleFavorite={toggleFavorite}
              user={user}
            />
          }
        />
        <Route
          path="/product/:id"
          element={
            <Product
              addToCart={addToCartWithToast}
              favoriteIds={favoriteIds}
              toggleFavorite={toggleFavorite}
              user={user}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              changeCartItemSize={changeCartItemSize}
            />
          }
        />
        <Route path="/siparis-basarili/:id" element={<OrderSuccess />} />
        <Route path="/auth" element={<Auth user={user} setUser={setUser} />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute user={user}>
              <Checkout cart={cart} setCart={setCart} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile
                favoriteIds={favoriteIds}
                fetchFavorites={fetchFavorites}
                addToCart={addToCartWithToast}
                toggleFavorite={toggleFavorite}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/siparislerim"
          element={
            <ProtectedRoute user={user}>
              <Siparislerim />
            </ProtectedRoute>
          }
        />
        <Route path="/products" element={<ProductList />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} admin>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute user={user} admin>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kategori/:gender?/:type?"
          element={
            <Category
              addToCart={addToCartWithToast}
              favoriteIds={favoriteIds}
              toggleFavorite={toggleFavorite}
              user={user}
            />
          }
        />

        <Route
          path="/indirim"
          element={
            <Discount
              addToCart={addToCartWithToast}
              favoriteIds={favoriteIds}
              toggleFavorite={toggleFavorite}
              user={user}
            />
          }
        />

        <Route
          path="/arama"
          element={
            <Search
              addToCart={addToCartWithToast}
              favoriteIds={favoriteIds}
              toggleFavorite={toggleFavorite}
              user={user}
            />
          }
        />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute user={user}>
              <Favorites
                addToCart={addToCartWithToast}
                toggleFavorite={toggleFavorite}
              />
            </ProtectedRoute>
          }
        />

        <Route path="/magazalar" element={<Magazalar />} />
        <Route path="/iletisim" element={<Iletisim />} />
        <Route
          path="/cantalar"
          element={
            <Cantalar
              addToCart={addToCartWithToast}
              favoriteIds={favoriteIds}
              toggleFavorite={toggleFavorite}
              user={user}
            />
          }
        />
        <Route
          path="/yeni-urunler"
          element={
            <YeniUrunler
              addToCart={addToCartWithToast}
              favoriteIds={favoriteIds}
              toggleFavorite={toggleFavorite}
              user={user}
            />
          }
        />
        <Route
          path="/one-cikan-urunler"
          element={
            <OneCikanUrunler
              addToCart={addToCartWithToast}
              favoriteIds={favoriteIds}
              toggleFavorite={toggleFavorite}
              user={user}
            />
          }
        />

        <Route path="/mesafeli-satis-sozlesmesi" element={<MesafeliSatis />} />
        <Route path="/gizlilik" element={<Gizlilik />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />

      <Toast
        visible={toast.show}
        message={toast.message}
        actionLabel={toast.actionLabel}
        actionTo={toast.actionTo}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  );
}

export default App;
