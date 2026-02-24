import { useState } from "react";
import { API_URL } from "../../config";

export default function ProfileInfo({ user, setUser }) {
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    setSaving(true);
    fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName, lastName, phone }),
    })
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
      <h2 className="font-semibold text-lg text-[var(--color-text-main)] mb-4">
        Kişisel Bilgiler
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">
        {user?.email}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
            Ad
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
            Soyad
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
            Telefon
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-2.5"
            placeholder="05XX XXX XX XX"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[var(--color-text-main)] text-white font-medium hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
