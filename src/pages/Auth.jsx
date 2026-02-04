import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

export default function Auth({ user, setUser }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    location.state?.from?.pathname || location.state?.redirect || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint =
        mode === "login" ? `${API_URL}/auth/login` : `${API_URL}/auth/register`;
      const body =
        mode === "login"
          ? { email, password }
          : { email, password, firstName, lastName };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Sunucu hatası oluştu");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Bir hata oluştu");

      if (mode === "register") {
        setMode("login");
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        alert("Kayıt başarılı. Giriş yapabilirsiniz.");
        return;
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      navigate(redirectTo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="page-container py-20 text-center">
        <h2 className="font-serif text-xl font-bold text-[var(--color-text-main)]">
          Zaten giriş yaptınız.
        </h2>
        <Link
          to="/"
          className="inline-block mt-4 text-[var(--color-accent)] font-medium hover:underline"
        >
          Anasayfaya dön
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container py-12 md:py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-[var(--color-border)] bg-slate-50/50">
            <h1 className="font-serif text-2xl font-bold text-[var(--color-text-main)]">
              {mode === "login" ? "Giriş Yap" : "Üye Ol"}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {mode === "login"
                ? "Hesabınıza giriş yapın"
                : "Yeni hesap oluşturun"}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-[var(--color-danger)] text-sm font-medium">
                {error}
              </div>
            )}
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                    Ad
                  </label>
                  <input
                    type="text"
                    placeholder="Adınız"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                    Soyad
                  </label>
                  <input
                    type="text"
                    placeholder="Soyadınız"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                E-posta
              </label>
              <input
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">
                Şifre
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] outline-none transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold bg-[var(--color-text-main)] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading
                ? "İşleniyor..."
                : mode === "login"
                ? "Giriş Yap"
                : "Üye Ol"}
            </button>
          </form>
          <div className="px-6 pb-6 pt-2 text-center text-sm text-[var(--color-text-secondary)]">
            {mode === "login" ? (
              <>
                Hesabınız yok mu?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-[var(--color-accent)] font-semibold hover:underline"
                >
                  Üye Ol
                </button>
              </>
            ) : (
              <>
                Zaten hesabınız var mı?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-[var(--color-accent)] font-semibold hover:underline"
                >
                  Giriş Yap
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
