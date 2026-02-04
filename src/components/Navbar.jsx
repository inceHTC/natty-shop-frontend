import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineClipboardList,
  HiOutlineLocationMarker,
  HiOutlineLogout,
} from "react-icons/hi";

export default function Navbar({ cart, user, setUser }) {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const accountRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) navigate(`/arama?q=${encodeURIComponent(q)}`);
    setMenuOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[var(--color-border)] shadow-sm">
      
   {/* TOP BAR */}
<div className="hidden md:block bg-[var(--color-bg-dark)] text-slate-300 text-xs overflow-hidden">
  <div className="page-container h-9 flex items-center justify-between gap-6">

    {/* KAYAN YAZI */}
    <div className="relative flex-1 overflow-hidden">
      <div
        className="whitespace-nowrap"
        style={{
          animation: "marquee 34s linear infinite",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animationPlayState = "running";
        }}
      >
        <span className="mx-6">
          🚚 750₺ ve üzeri alışverişlerde KARGO BEDAVA
        </span>
        <span className="mx-6 text-[var(--color-accent)] font-semibold">
          💳 Peşin fiyatına 6 taksit
        </span>
        <span className="mx-6">
          🔄 14 gün ücretsiz iade
        </span>
        <span className="mx-6">
          ⚡ Aynı gün kargo
        </span>
      </div>
    </div>

    {/* SAĞ TARAF SABİT LINKLER */}
    <div className="flex items-center gap-6 shrink-0">
      <Link to="/magazalar" className="hover:text-white">
        Mağazalar
      </Link>
      <Link to="/iletisim" className="hover:text-white">
        İletişim
      </Link>

      {user?.role === "admin" && (
        <Link
          to="/admin"
          className="text-[var(--color-accent)] font-semibold"
        >
          Admin Panel
        </Link>
      )}

      {!user ? (
        <Link to="/auth" className="hover:text-white">
          Giriş / Üyelik
        </Link>
      ) : (
        <button onClick={logout} className="hover:text-white">
          Çıkış Yap
        </button>
      )}
    </div>
  </div>

  {/* INLINE KEYFRAMES (Tailwind config yok) */}
  <style>
    {`
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    `}
  </style>
</div>

      {/* MAIN NAVBAR */}
      <div className="bg-white">
        <div className="page-container h-16 md:h-20 flex items-center justify-between gap-4">
          {/* MENU BUTTON */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menüyü aç"
            className="group relative flex flex-col justify-center gap-[5px] p-2 -ml-2"
          >
            {/* ÜST ÇİZGİ */}
            <span
              className={`
      block h-[1.5px] w-6 bg-[var(--color-text-main)]
      transition-all duration-300
      ${menuOpen ? "translate-y-[6px] rotate-45" : ""}
    `}
            />

            {/* ORTA ÇİZGİ */}
            <span
              className={`
      block h-[1.5px] w-4 bg-[var(--color-text-main)]
      transition-all duration-200
      ${menuOpen ? "opacity-0" : "group-hover:opacity-70"}
    `}
            />

            {/* ALT ÇİZGİ */}
            <span
              className={`
      block h-[1.5px] w-6 bg-[var(--color-text-main)]
      transition-all duration-300
      ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}
    `}
            />
          </button>

          {/* LOGO */}
          <Link
            to="/"
            className="brand-logo text-3xl md:text-4xl text-[var(--color-text-main)]"
          >
            NATTY
          </Link>

          {/* SEARCH (DESKTOP) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-6"
          >
            <div className="relative w-full">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Ürün, marka veya kategori ara"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-[var(--color-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-accent)]/30 outline-none"
              />
            </div>
          </form>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* ACCOUNT */}
            <div className="relative" ref={accountRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setAccountOpen((o) => !o)}
                    className="p-2 text-2xl"
                  >
                    <HiOutlineUser />
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-[var(--color-border)] rounded-xl shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="font-semibold truncate">
                          {user.firstName || "Hesabım"}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
                      >
                        <HiOutlineUser /> Hesabım
                      </Link>

                      <Link
                        to="/siparislerim"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
                      >
                        <HiOutlineClipboardList /> Siparişlerim
                      </Link>

                      <Link
                        to="/profile#adreslerim"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
                      >
                        <HiOutlineLocationMarker /> Adreslerim
                      </Link>

                      <Link
                        to="/favorites"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50"
                      >
                        <HiOutlineHeart /> Favorilerim
                      </Link>

                      <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[var(--color-danger)] hover:bg-red-50"
                      >
                        <HiOutlineLogout /> Çıkış Yap
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/auth" className="p-2 text-2xl">
                  <HiOutlineUser />
                </Link>
              )}
            </div>

            {/* FAVORITES */}
            <Link to="/favorites" className="p-2 text-2xl text-red-500">
              <HiOutlineHeart />
            </Link>

            {/* CART */}
            <Link to="/cart" className="relative p-2 text-2xl">
              <HiOutlineShoppingBag />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--color-accent)] text-xs font-bold rounded-full px-1">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      {menuOpen && (
        <>
          {/* OVERLAY */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMenuOpen(false)}
          />

          {/* SIDEBAR */}
          <aside className="fixed top-0 left-0 z-50 h-full w-[320px] bg-white flex flex-col">
            <div className="h-16 px-4 flex items-center justify-between border-b">
              <span className="text-lg font-bold">Menü</span>
              <button onClick={() => setMenuOpen(false)} className="text-2xl">
                <HiOutlineX />
              </button>
            </div>

            <form onSubmit={handleSearch} className="p-4 border-b">
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl" />
                <input
                  type="text"
                  placeholder="Ürün ara"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border rounded-xl pl-10 pr-4 py-3"
                />
              </div>
            </form>

            <nav className="flex-1 overflow-y-auto p-4 text-base">
              <Link
                to="/kategori/kadin"
                onClick={() => setMenuOpen(false)}
                className="block py-3 border-b"
              >
                Kadın
              </Link>
              <Link
                to="/kategori/erkek"
                onClick={() => setMenuOpen(false)}
                className="block py-3 border-b"
              >
                Erkek
              </Link>
              <Link
                to="/kategori/kadin/ayakkabi"
                onClick={() => setMenuOpen(false)}
                className="block py-3"
              >
                Kadın Ayakkabı
              </Link>
              <Link
                to="/kategori/erkek/ayakkabi"
                onClick={() => setMenuOpen(false)}
                className="block py-3"
              >
                Erkek Ayakkabı
              </Link>
              <Link
                to="/kategori/kadin/canta"
                onClick={() => setMenuOpen(false)}
                className="block py-3"
              >
                Kadın Çanta
              </Link>
              <Link
                to="/kategori/erkek/canta"
                onClick={() => setMenuOpen(false)}
                className="block py-3"
              >
                Erkek Çanta
              </Link>
              <Link
                to="/indirim"
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-[var(--color-danger)] font-semibold"
              >
                İndirim
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 font-semibold text-[var(--color-accent)]"
                >
                  Admin Panel
                </Link>
              )}
            </nav>
          </aside>
        </>
      )}
    </header>
  );
}
