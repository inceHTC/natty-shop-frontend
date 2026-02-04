import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_URL } from "../config";

/* =====================
   Görsel URL yardımcısı (tek kaynak)
===================== */
function getImageUrl(url, gender = "kadin") {
  if (!url) return "";
  const base = `${API_URL}/images`;
  return url.includes("/") ? `${base}/${url}` : `${base}/${gender}/${url}`;
}

export default function Admin() {
  const token = localStorage.getItem("token");
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    gender: "kadin",
    type: "ayakkabi",
    isDiscount: false,
    oldPrice: "",
    isFeatured: false,
  });

  // 👟 AYAKKABI BEDENLERİ
  const WOMEN_SIZES = [35, 36, 37, 38, 39, 40];
  const MEN_SIZES = [40, 41, 42, 43, 44, 45];

  const [sizes, setSizes] = useState([]);

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [extraPreview, setExtraPreview] = useState([]);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const [sizeStocks, setSizeStocks] = useState({});

  const openEditModal = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEditingProduct({
        ...data,
        images: Array.isArray(data.images) ? data.images : [],
        sizes: data.sizes || [],
      });

      setExtraImages([]);
      setExtraPreview([]);
    } catch (err) {
      console.error("Edit açılırken hata:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const urls = [...preview, ...extraPreview];
    return () =>
      urls.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
  }, [preview, extraPreview]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const handleExtraImages = (e) => {
    const files = Array.from(e.target.files || []);
    setExtraImages(files);
    setExtraPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const createProduct = async (e) => {
    e.preventDefault();
    if (!images.length) {
      alert("En az 1 görsel ekleyin");
      return;
    }
    setCreating(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (form.type === "ayakkabi") {
        if (!sizes.length) {
          alert("Ayakkabı için en az 1 numara seçmelisin");
          setCreating(false);
          return;
        }

        fd.append(
          "sizes",
          JSON.stringify(
            sizes.map((s) => ({
              size: String(s),
              stock: Number(sizeStocks[s] ?? 0),
            })),
          ),
        );
      }

      images.forEach((img) => fd.append("images", img));

      const res = await fetch(`${API_URL}/admin/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Ürün eklenemedi");
        return;
      }
      setProducts((p) => [data, ...p]);
      setForm({
        name: "",
        price: "",
        description: "",
        gender: "kadin",
        type: "ayakkabi",
        isDiscount: false,
        oldPrice: "",
        isFeatured: false,
      });
      setImages([]);
      setPreview([]);
      setSizes([]);
      setSizeStocks({});
    } catch (err) {
      console.error(err);
      alert("Ürün eklenirken bir hata oluştu");
    } finally {
      setCreating(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`${API_URL}/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.message || "Ürün silinemedi");
      return;
    }
    setProducts((p) => p.filter((x) => x.id !== id));
  };

const deleteImage = async (imageId) => {
  if (!confirm("Bu görseli silmek istediğinize emin misiniz?")) return;

  const res = await fetch(
    `${API_URL}/admin/product-images/${imageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    alert("Görsel silinemedi");
    return;
  }

  setEditingProduct((p) => ({
    ...p,
    images: p.images.filter((img) => img.id !== imageId),
  }));
};

  const setMainImage = async (imageId) => {
    const res = await fetch(`${API_URL}/admin/product-images/${imageId}/main`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      alert("Ana görsel güncellenemedi");
      return;
    }
    setEditingProduct((p) => ({
      ...p,
      images: (p.images || []).map((img) => ({
        ...img,
        isMain: img.id === imageId,
      })),
    }));
  };

const saveEdit = async () => {
  if (!editingProduct) return;
  setSaving(true);

  try {
    // 1️⃣ ÜRÜN BİLGİLERİ (JSON)
    const res = await fetch(
      `${API_URL}/admin/products/${editingProduct.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editingProduct,
          sizes:
            editingProduct.type === "ayakkabi"
              ? editingProduct.sizes
              : [],
        }),
      },
    );

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.message || "Ürün güncellenemedi");
      return;
    }

    // 2️⃣ YENİ GÖRSELLER (FORMDATA)
    if (extraImages.length) {
      const fd = new FormData();
      extraImages.forEach((img) => fd.append("images", img));
      fd.append("gender", editingProduct.gender);

      const resImg = await fetch(
        `${API_URL}/admin/products/${editingProduct.id}/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        },
      );

      if (!resImg.ok) {
        alert("Yeni görseller eklenirken hata oluştu");
      }
    }

    await fetchProducts();
    setEditingProduct(null);
    setExtraImages([]);
    setExtraPreview([]);
  } catch (err) {
    console.error(err);
    alert("Ürün güncellenirken bir hata oluştu");
  } finally {
    setSaving(false);
  }
};


  const displayImages = editingProduct
    ? editingProduct.images?.length
      ? editingProduct.images
      : editingProduct.image
        ? [{ id: "main", url: editingProduct.image, isMain: true }]
        : []
    : [];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <aside className="w-56 bg-slate-900 text-white flex-shrink-0" />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-slate-500">Yükleniyor...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-60 bg-slate-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-slate-700">
          <h1 className="text-lg font-semibold tracking-tight">Admin Panel</h1>
          <p className="text-slate-400 text-xs mt-1">Yönetim Paneli</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/admin"
                ? "bg-slate-700 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="text-slate-400">📦</span> Ürünler
          </Link>
          <Link
            to="/admin/orders"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/admin/orders"
                ? "bg-slate-700 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="text-slate-400">📋</span> Siparişler
          </Link>
        </nav>
        <div className="p-3 border-t border-slate-700">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            ← Siteye Dön
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 lg:p-8 space-y-8">
          {/* YENİ ÜRÜN KARTI */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-800">
                Yeni Ürün Ekle
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Zorunlu alanları doldurup en az bir görsel yükleyin
              </p>
            </div>
            <form onSubmit={createProduct} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Ürün adı
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Örn. Deri Bilek Çantası"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-slate-300 focus:border-slate-300 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Fiyat (₺)
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-slate-300 focus:border-slate-300 outline-none transition"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Cinsiyet
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-slate-300 focus:border-slate-300 outline-none"
                  >
                    <option value="kadin">Kadın</option>
                    <option value="erkek">Erkek</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Kategori
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-slate-300 focus:border-slate-300 outline-none"
                  >
                    <option value="ayakkabi">Ayakkabı</option>
                    <option value="canta">Çanta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Ürün açıklaması"
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-slate-300 focus:border-slate-300 outline-none transition resize-none"
                />

                {form.type === "ayakkabi" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Ayakkabı Numaraları
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {(form.gender === "kadin" ? WOMEN_SIZES : MEN_SIZES).map(
                        (size) => {
                          const selected = sizes.includes(size);

                          return (
                            <div
                              key={size}
                              className={`px-3 py-2 rounded-lg border text-sm ${
                                selected
                                  ? "border-slate-900"
                                  : "border-slate-300 text-slate-700"
                              }`}
                            >
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() =>
                                    setSizes((prev) =>
                                      prev.includes(size)
                                        ? prev.filter((s) => s !== size)
                                        : [...prev, size],
                                    )
                                  }
                                />
                                {size}
                              </label>

                              {selected && (
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Stok"
                                  value={sizeStocks[size] ?? ""}
                                  onChange={(e) =>
                                    setSizeStocks((p) => ({
                                      ...p,
                                      [size]: Number(e.target.value),
                                    }))
                                  }
                                  className="mt-1 w-20 border border-slate-200 rounded px-2 py-1 text-xs"
                                />
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-6 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDiscount"
                    checked={form.isDiscount}
                    onChange={handleChange}
                    className="rounded border-slate-300 text-slate-700 focus:ring-slate-400"
                  />
                  <span className="text-sm text-slate-700">İndirimli</span>
                </label>
                {form.isDiscount && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-slate-600">
                      Eski fiyat (₺)
                    </label>
                    <input
                      name="oldPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.oldPrice}
                      onChange={handleChange}
                      className="w-28 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                )}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    className="rounded border-slate-300 text-slate-700 focus:ring-slate-400"
                  />
                  <span className="text-sm text-slate-700">
                    Anasayfada göster
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Görseller (en az 1, en fazla 5)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer"
                />
                {preview.length > 0 && (
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {preview.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-sm"
                      />
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={creating || !images.length}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {creating ? "Ekleniyor..." : "Ürün Ekle"}
              </button>
            </form>
          </section>

          {/* ÜRÜN LİSTESİ */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-800">
                Ürün Listesi
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {products.length} ürün
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-medium">
                    <th className="text-left p-4 w-20">Görsel</th>
                    <th className="text-left p-4">Ürün</th>
                    <th className="text-left p-4">Fiyat</th>
                    <th className="text-center p-4">Vitrin</th>
                    <th className="text-right p-4">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const thumbUrl =
                      p.images?.find((i) => i.isMain)?.url ||
                      p.images?.[0]?.url ||
                      p.image;
                    const thumbSrc = thumbUrl
                      ? getImageUrl(thumbUrl, p.gender)
                      : "";
                    return (
                      <tr
                        key={p.id}
                        className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                            {thumbSrc ? (
                              <img
                                src={thumbSrc}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                Yok
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-800">
                          {p.name}
                        </td>
                        <td className="p-4 text-slate-600">
                          {Number(p.price).toFixed(2)} ₺
                        </td>
                        <td className="p-4 text-center">
                          {p.isFeatured ? "⭐" : "—"}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(p.id)}
                            className="text-slate-700 hover:text-slate-900 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            Düzenle
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                            className="text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Sil
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* DÜZENLE MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border border-slate-200">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-semibold text-slate-800">
                Ürün Düzenle
              </h2>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ürün adı
                  </label>
                  <input
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-slate-300 outline-none"
                    placeholder="Ürün adı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-slate-300 outline-none"
                    placeholder="Fiyat"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Cinsiyet
                  </label>
                  <select
                    value={editingProduct.gender}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        gender: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-slate-300 outline-none"
                  >
                    <option value="kadin">Kadın</option>
                    <option value="erkek">Erkek</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={editingProduct.type}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        type: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-slate-300 outline-none"
                  >
                    <option value="ayakkabi">Ayakkabı</option>
                    <option value="canta">Çanta</option>
                    <option value="giyim">Giyim</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-slate-300 outline-none resize-none"
                  placeholder="Ürün açıklaması"
                />
              </div>

              {/* AYAKKABI NUMARA & STOK (EDIT) */}
              {editingProduct.type === "ayakkabi" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ayakkabı Numaraları & Stok
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {(editingProduct.gender === "kadin"
                      ? WOMEN_SIZES
                      : MEN_SIZES
                    ).map((size) => {
                      const sizeObj =
                        editingProduct.sizes?.find(
                          (s) => String(s.size) === String(size),
                        ) || null;

                      const selected = !!sizeObj;

                      return (
                        <div
                          key={size}
                          className={`px-3 py-2 rounded-lg border text-sm ${
                            selected
                              ? "border-slate-900"
                              : "border-slate-300 text-slate-500"
                          }`}
                        >
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => {
                                setEditingProduct((p) => ({
                                  ...p,
                                  sizes: selected
                                    ? p.sizes.filter(
                                        (s) => String(s.size) !== String(size),
                                      )
                                    : [...(p.sizes || []), { size, stock: 0 }],
                                }));
                              }}
                            />
                            {size}
                          </label>

                          {selected && (
                            <input
                              type="number"
                              min="0"
                              value={sizeObj?.stock ?? 0}
                              onChange={(e) =>
                                setEditingProduct((p) => ({
                                  ...p,
                                  sizes: p.sizes.map((s) =>
                                    String(s.size) === String(size)
                                      ? { ...s, stock: Number(e.target.value) }
                                      : s,
                                  ),
                                }))
                              }
                              className="mt-1 w-20 border border-slate-200 rounded px-2 py-1 text-xs"
                              placeholder="Stok"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-6 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingProduct.isDiscount}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        isDiscount: e.target.checked,
                        oldPrice: e.target.checked
                          ? editingProduct.oldPrice || ""
                          : null,
                      })
                    }
                    className="rounded border-slate-300 text-slate-700 focus:ring-slate-400"
                  />
                  <span className="text-sm text-slate-700">İndirimli</span>
                </label>
                {editingProduct.isDiscount && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-slate-600">
                      Eski fiyat (₺)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.oldPrice ?? ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          oldPrice: e.target.value,
                        })
                      }
                      className="w-28 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                )}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingProduct.isFeatured}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        isFeatured: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-slate-700 focus:ring-slate-400"
                  />
                  <span className="text-sm text-slate-700">
                    Anasayfada göster
                  </span>
                </label>
              </div>

              {/* MEVCUT GÖRSELLER */}
              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-3">
                  Mevcut Görseller
                </h3>
                {displayImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {displayImages.map((img) => {
                      const src = getImageUrl(
                        img.url,
                        editingProduct.gender || "kadin",
                      );
                      const isSynthetic = img.id === "main";
                      return (
                        <div
                          key={img.id}
                          className={`relative rounded-xl overflow-hidden border-2 bg-slate-50 ${
                            img.isMain
                              ? "border-slate-900 ring-2 ring-slate-900/20"
                              : "border-slate-200"
                          }`}
                        >
                          <div className="aspect-square flex items-center justify-center bg-slate-100">
                            <img
                              src={src}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                            {isSynthetic ? (
                              <span className="text-white text-xs font-medium">
                                Ana görsel (tek)
                              </span>
                            ) : (
                              <>
                                {!img.isMain && (
                                  <button
                                    type="button"
                                    onClick={() => setMainImage(img.id)}
                                    className="text-white text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded"
                                  >
                                    Ana Yap
                                  </button>
                                )}
                                {!isSynthetic && (
                                  <button
                                    type="button"
                                    onClick={() => deleteImage(img.id)}
                                    className="text-white text-xs bg-red-600 hover:bg-red-500 px-2 py-1 rounded"
                                  >
                                    Sil
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                          {img.isMain && (
                            <span className="absolute top-2 left-2 bg-slate-900 text-white text-xs px-2 py-0.5 rounded">
                              Ana
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 py-3">
                    Bu ürüne ait görsel yok. Aşağıdan yeni görsel
                    ekleyebilirsiniz.
                  </p>
                )}
              </div>

              {/* YENİ GÖRSEL EKLE */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Yeni Görsel Ekle
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleExtraImages}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer"
                />
                {extraPreview.length > 0 && (
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {extraPreview.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-sm"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
