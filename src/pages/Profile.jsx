import { useEffect, useState } from "react";
import { API_URL } from "../config";
import { useLocation } from "react-router-dom";
import { getValidToken, clearAuth } from "../utils/auth";

import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfileInfo from "../components/profile/ProfileInfo";
import ProfileOrders from "../components/profile/ProfileOrders";
import ProfileAddresses from "../components/profile/ProfileAddresses";
import ProfileFavorites from "../components/profile/ProfileFavorites";
import ProfilePassword from "../components/profile/ProfilePassword";

export default function Profile({
  favoriteIds,
  addToCart,
  toggleFavorite,
}) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // 🔹 Dış linkten tab ile gelinirse
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 🔹 Profil verileri – sadece geçerli token varsa istek at (401 konsol hatasını önler)
  useEffect(() => {
    const validToken = getValidToken();
    if (!validToken) {
      clearAuth();
      return;
    }

    const authHeaders = { Authorization: `Bearer ${validToken}` };

    const handleRes = (res) => {
      if (res.status === 401) {
        clearAuth();
        return [];
      }
      return res.json();
    };

    fetch(`${API_URL}/profile`, { headers: authHeaders })
      .then(handleRes)
      .then((data) => setUser(Array.isArray(data) ? null : data))
      .catch(() => setUser(null));

    fetch(`${API_URL}/orders/my`, { headers: authHeaders })
      .then(handleRes)
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]));

    fetch(`${API_URL}/addresses`, { headers: authHeaders })
      .then(handleRes)
      .then((data) => setAddresses(Array.isArray(data) ? data : []))
      .catch(() => setAddresses([]));

    fetch(`${API_URL}/favorites`, { headers: authHeaders })
      .then(handleRes)
      .then((data) => setFavorites(Array.isArray(data) ? data : []))
      .catch(() => setFavorites([]));
  }, [token]);

  if (!user) return null;

  return (
    <div className="page-container py-10 md:py-14">
      <h1 className="font-serif text-2xl md:text-3xl font-bold mb-8">
        Hesabım
      </h1>

      {/* 🔥 KRİTİK DÜZELTME */}
   <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

        
        {/* Sidebar */}
        <div className="w-full lg:w-[280px] shrink-0">
          <ProfileSidebar active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content */}
        <div className="w-full flex-1 mt-4 lg:mt-0">
          {activeTab === "info" && (
            <ProfileInfo user={user} setUser={setUser} />
          )}
          {activeTab === "orders" && (
            <ProfileOrders orders={orders} />
          )}
          {activeTab === "addresses" && (
            <ProfileAddresses
              addresses={addresses}
              setAddresses={setAddresses}
            />
          )}
          {activeTab === "favorites" && (
            <ProfileFavorites
              favorites={favorites}
              favoriteIds={favoriteIds}
              addToCart={addToCart}
              toggleFavorite={toggleFavorite}
              setFavorites={setFavorites}
            />
          )}
          {activeTab === "password" && <ProfilePassword />}
        </div>
      </div>
    </div>
  );
}
