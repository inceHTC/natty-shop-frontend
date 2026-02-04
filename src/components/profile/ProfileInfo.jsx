import { useState } from "react";
import { API_URL } from "../../config";

const inputClass =
  "w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition";

export default function ProfileInfo({ user, setUser }) {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
  });

  const updateProfile = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data.message || "Bilgiler güncellenemedi");
      return;
    }

    setUser((u) => ({ ...u, ...form }));
    alert("Bilgileriniz güncellendi");
  };

  return (
    <section>
      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm">
        
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold">
            Üyelik Bilgilerim
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Kişisel bilgilerinizi buradan güncelleyebilirsiniz.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={updateProfile} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Ad</label>
              <input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Soyad</label>
              <input
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Telefon</label>
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">E-posta</label>
              <input
                value={user.email}
                disabled
                className={`${inputClass} bg-slate-100 cursor-not-allowed`}
              />
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="pt-4 border-t border-[var(--color-border)] flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold bg-black text-white hover:opacity-90 transition"
            >
              Bilgileri Kaydet
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
