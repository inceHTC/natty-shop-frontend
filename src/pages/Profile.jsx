import { useEffect, useState } from "react";
import { API_URL } from "../config";

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

  const [activeTab, setActiveTab] = useState("info");

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setUser)
      .catch(() => setUser(null));

    fetch(`${API_URL}/orders/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => setOrders([]));

    fetch(`${API_URL}/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setAddresses)
      .catch(() => setAddresses([]));

    fetch(`${API_URL}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setFavorites)
      .catch(() => setFavorites([]));
  }, [token]);

  if (!user) return null;

  return (
    <div className="page-container py-10 md:py-14">
      <h1 className="font-serif text-2xl md:text-3xl font-bold mb-8">
        Hesabım
      </h1>

      <div className="flex gap-10">
        <ProfileSidebar active={activeTab} onChange={setActiveTab} />

        <div className="flex-1">
          {activeTab === "info" && <ProfileInfo user={user} setUser={setUser} />}
          {activeTab === "orders" && <ProfileOrders orders={orders} />}
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
