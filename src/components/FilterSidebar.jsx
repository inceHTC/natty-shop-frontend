import { useSearchParams } from "react-router-dom";
import PriceRange from "./PriceRange";

export default function FilterSidebar() {
  const [params, setParams] = useSearchParams();

  const sizes = params.get("sizes")?.split(",") || [];

  const toggleParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (next.get(key) === value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setParams(next);
  };

  const toggleSize = (size) => {
    const next = new URLSearchParams(params);
    const current = next.get("sizes")?.split(",") || [];

    const updated = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size];

    if (updated.length > 0) {
      next.set("sizes", updated.join(","));
    } else {
      next.delete("sizes");
    }

    setParams(next);
  };

  const clearFilters = () => {
  const next = new URLSearchParams();

  // Eğer indirim sayfasındaysak discount=true KORU
  if (params.get("discount") === "true") {
    next.set("discount", "true");
  }

  setParams(next);
};

  return (
    <div className="border rounded-xl p-5 space-y-6 bg-white">
      <h3 className="font-semibold text-lg">Filtrele</h3>

      {/* 👩‍🦰 / 👨‍🦱 CİNSİYET */}
      <div>
        <p className="font-medium mb-2">Cinsiyet</p>
        <div className="flex gap-2">
          {[
            { label: "Kadın", value: "kadin" },
            { label: "Erkek", value: "erkek" },
          ].map((g) => (
            <button
              key={g.value}
              onClick={() => toggleParam("gender", g.value)}
              className={`px-3 py-2 rounded-md border text-sm
                ${
                  params.get("gender") === g.value
                    ? "bg-black text-white border-black"
                    : "hover:border-black"
                }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* 👟 / 👜 KATEGORİ */}
      <div>
        <p className="font-medium mb-2">Kategori</p>
        <div className="flex gap-2">
          {[
            { label: "Ayakkabı", value: "ayakkabi" },
            { label: "Çanta", value: "canta" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => toggleParam("type", t.value)}
              className={`px-3 py-2 rounded-md border text-sm
                ${
                  params.get("type") === t.value
                    ? "bg-black text-white border-black"
                    : "hover:border-black"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 👟 NUMARA */}
      <div>
        <p className="font-medium mb-2">Numara</p>
        <div className="grid grid-cols-4 gap-2">
          {["36", "37", "38", "39", "40"].map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`border rounded-md py-2 text-sm
                ${
                  sizes.includes(size)
                    ? "bg-black text-white border-black"
                    : "hover:border-black"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 💰 FİYAT */}
      <div>
        <p className="font-medium mb-2">Fiyat Aralığı</p>
        <PriceRange min={0} max={5000} step={50} />
      </div>

      {/* 🔥 İNDİRİM */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={params.get("discount") === "true"}
          onChange={(e) => {
            const next = new URLSearchParams(params);
            e.target.checked
              ? next.set("discount", "true")
              : next.delete("discount");
            setParams(next);
          }}
        />
        İndirimli ürünler
      </label>

      {/* 🧹 FİLTRELERİ TEMİZLE */}
<button
  type="button"
  onClick={clearFilters}
  className="hidden lg:block w-full py-2 rounded-md border text-sm font-medium
             hover:bg-slate-50 transition"
>
  Filtreleri Temizle
</button>


    </div>
  );
}
